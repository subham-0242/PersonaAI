from __future__ import annotations

import logging
import time
from typing import Any, Dict, Literal, Optional

from ..services.session_context import session_manager
from ..services.tts_service import tts_service
from .nodes.auditor_node import auditor_node
from .nodes.coordinator_node import coordinator_node
from .nodes.hiring_manager_node import hiring_manager_node
from .nodes.product_manager_node import product_manager_node
from .nodes.tech_lead_node import tech_lead_node
from .state import InterviewState, create_initial_state

logger = logging.getLogger("personapanel.orchestration.graph")


# -----------------------------------------------------------------------------
# Routing Function for Conditional Edge
# -----------------------------------------------------------------------------
def route_by_persona(
    state: InterviewState,
) -> Literal["tech_lead", "product_manager", "hiring_manager"]:
    """
    Directs workflow from Auditor to the designated active persona node.
    """
    persona = state.get("active_persona", "alex").lower().strip()
    if persona == "sarah":
        return "product_manager"
    elif persona == "jordan":
        return "hiring_manager"
    return "tech_lead"


# -----------------------------------------------------------------------------
# LangGraph Workflow Definition & Compilation
# -----------------------------------------------------------------------------
try:
    from langgraph.graph import END, START, StateGraph

    def build_interview_graph():
        workflow = StateGraph(InterviewState)

        # Register Nodes
        workflow.add_node("auditor", auditor_node)
        workflow.add_node("tech_lead", tech_lead_node)
        workflow.add_node("product_manager", product_manager_node)
        workflow.add_node("hiring_manager", hiring_manager_node)
        workflow.add_node("coordinator", coordinator_node)

        # Build Graph Topology
        workflow.add_edge(START, "auditor")
        workflow.add_conditional_edges(
            "auditor",
            route_by_persona,
            {
                "tech_lead": "tech_lead",
                "product_manager": "product_manager",
                "hiring_manager": "hiring_manager",
            },
        )
        workflow.add_edge("tech_lead", "coordinator")
        workflow.add_edge("product_manager", "coordinator")
        workflow.add_edge("hiring_manager", "coordinator")
        workflow.add_edge("coordinator", END)

        return workflow.compile()

    interview_graph = build_interview_graph()
    LANGGRAPH_ACTIVE = True
    logger.info("LangGraph multi-agent interview graph compiled successfully.")

except ImportError:
    interview_graph = None
    LANGGRAPH_ACTIVE = False
    logger.info("LangGraph package not directly importable; using resilient native state machine.")


# -----------------------------------------------------------------------------
# Native State Machine Fallback (Exact 1:1 Graph Topology)
# -----------------------------------------------------------------------------
async def run_native_state_machine(state: InterviewState) -> InterviewState:
    """
    Asynchronous state machine matching the exact LangGraph topology:
    START -> auditor -> route_by_persona -> [persona_node] -> coordinator -> END
    """
    current_state = dict(state)

    # 1. Auditor Node
    auditor_update = await auditor_node(current_state)
    current_state.update(auditor_update)

    # 2. Dynamic Route
    route = route_by_persona(current_state)

    # 3. Persona Node Execution
    if route == "product_manager":
        persona_update = await product_manager_node(current_state)
    elif route == "hiring_manager":
        persona_update = await hiring_manager_node(current_state)
    else:
        persona_update = await tech_lead_node(current_state)
    current_state.update(persona_update)

    # 4. Coordinator & Handoff Node
    coordinator_update = await coordinator_node(current_state)
    current_state.update(coordinator_update)

    return current_state


# -----------------------------------------------------------------------------
# High-Level Execution Wrapper with Audio & Redis Sync
# -----------------------------------------------------------------------------
async def execute_interview_turn(
    session_id: str,
    candidate_text: str,
    synthesize_voice: bool = True,
) -> Dict[str, Any]:
    """
    Coordinates an entire multi-agent conversational turn:
    1. Fetches current session context from Redis / In-memory store.
    2. Builds initial InterviewState.
    3. Executes the compiled LangGraph workflow.
    4. Records turn and updates difficulty / persona in Redis.
    5. Synthesizes low-latency audio via Edge-TTS.
    6. Returns clean payload for WebSocket or HTTP streaming.
    """
    # 1. Load session context
    context = await session_manager.get_full_session_context(session_id)
    active_persona = context.get("current_persona", "alex")
    difficulty = context.get("difficulty_level", 3)
    history = context.get("recent_turns", [])
    claims = context.get("claims", [])
    profile = context.get("candidate_profile", {})
    role_pack = context.get("role_pack", {})

    # Record Candidate Turn in Redis History
    await session_manager.add_turn(
        session_id=session_id,
        speaker="candidate",
        text=candidate_text,
        persona="candidate",
    )

    # 2. Build initial state
    initial_state = create_initial_state(
        session_id=session_id,
        candidate_text=candidate_text,
        active_persona=active_persona,
        turn_index=len(history) + 1,
        turns_history=history,
        candidate_profile=profile,
        role_pack=role_pack,
        verified_claims=claims,
        difficulty_level=difficulty,
    )

    # 3. Execute LangGraph or native state machine
    start_time = time.time()
    if LANGGRAPH_ACTIVE and interview_graph is not None:
        try:
            final_state = await interview_graph.ainvoke(initial_state)
        except Exception as e:
            logger.error("Error running LangGraph ainvoke: %s. Falling back to native machine.", e)
            final_state = await run_native_state_machine(initial_state)
    else:
        final_state = await run_native_state_machine(initial_state)

    execution_duration = round((time.time() - start_time) * 1000, 2)
    logger.info("Interview turn executed in %s ms (Session: %s)", execution_duration, session_id)

    # 4. Extract generated turn details
    speaker_output = final_state.get("current_speaker_output", {})
    response_persona = speaker_output.get("persona", active_persona)
    response_text = speaker_output.get("cleaned_text", "")
    raw_text = speaker_output.get("raw_text", "")
    handoff_decision = final_state.get("handoff_decision", {})
    contradiction_alert = final_state.get("contradiction_alert")
    new_difficulty = final_state.get("difficulty_level", difficulty)
    next_persona = final_state.get("active_persona", response_persona)

    # 5. Synchronize State with Redis
    # Record AI Turn
    await session_manager.add_turn(
        session_id=session_id,
        speaker=response_persona,
        text=response_text,
        persona=response_persona,
        handoff=handoff_decision.get("next_persona") if handoff_decision.get("handoff_occurred") else None,
        metadata={
            "execution_ms": execution_duration,
            "raw_text": raw_text,
            "difficulty_level": new_difficulty,
        },
    )

    # Update difficulty if changed
    if new_difficulty != difficulty:
        await session_manager.set_difficulty(session_id, new_difficulty)

    # Update active persona if handoff occurred
    if handoff_decision.get("handoff_occurred"):
        await session_manager.set_current_persona(session_id, next_persona)

    # Update verified claims if new ones were added
    updated_claims = final_state.get("verified_claims", [])
    for c in updated_claims:
        if c not in claims:
            await session_manager.add_claim(session_id, c)

    # 6. Synthesize Voice via Edge-TTS
    audio_b64: Optional[str] = None
    if synthesize_voice and response_text:
        try:
            audio_b64 = await tts_service.synthesize_to_base64(
                text=response_text,
                persona=response_persona,
            )
        except Exception as te:
            logger.error("TTS voice generation failed: %s", te)

    return {
        "session_id": session_id,
        "speaker": response_persona,
        "text": response_text,
        "raw_text": raw_text,
        "audio_b64": audio_b64,
        "handoff": handoff_decision,
        "contradiction": contradiction_alert,
        "difficulty_level": new_difficulty,
        "next_persona": next_persona,
        "execution_duration_ms": execution_duration,
        "timestamp": time.time(),
    }
