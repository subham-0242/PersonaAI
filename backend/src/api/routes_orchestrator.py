from __future__ import annotations

import logging
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from ..orchestration.graph import LANGGRAPH_ACTIVE, execute_interview_turn

logger = logging.getLogger("personapanel.routes_orchestrator")
router = APIRouter(prefix="/api/orchestrate", tags=["Multi-Agent Orchestrator"])


class TurnExecutionRequest(BaseModel):
    session_id: str = Field(description="Target session ID")
    candidate_text: str = Field(description="Spoken or typed candidate response")
    synthesize_voice: bool = Field(default=False, description="Whether to include base64 audio response")


@router.post(
    "/turn",
    summary="Execute Multi-Agent Turn via LangGraph",
    description=(
        "Executes a stateful interview turn through the compiled LangGraph state machine: "
        "Auditor (Gemini) -> Active Persona (Alex/Sarah/Jordan on openai/gpt-oss-120b) -> "
        "Coordinator Handoff & Difficulty Engine."
    ),
)
async def execute_turn_endpoint(request: TurnExecutionRequest) -> Dict[str, Any]:
    if not request.candidate_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="candidate_text cannot be empty.",
        )
    try:
        result = await execute_interview_turn(
            session_id=request.session_id,
            candidate_text=request.candidate_text,
            synthesize_voice=request.synthesize_voice,
        )
        return {
            "status": "success",
            "langgraph_active": LANGGRAPH_ACTIVE,
            "turn_result": result,
        }
    except Exception as e:
        logger.error("Error executing multi-agent turn: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Turn execution failed: {str(e)}",
        )


@router.get(
    "/topology",
    summary="Get Multi-Agent Graph Topology",
    description="Returns the structural nodes, conditional routing, and handoff triggers of the state machine.",
)
async def get_graph_topology() -> Dict[str, Any]:
    return {
        "framework": "LangGraph" if LANGGRAPH_ACTIVE else "Native StateGraph",
        "entry_node": "auditor",
        "nodes": [
            {
                "id": "auditor",
                "model": "gemini-2.0-flash",
                "role": "Real-time fact checking, resume claim verification, and contradiction detection",
            },
            {
                "id": "tech_lead",
                "persona": "Alex",
                "model": "openai/gpt-oss-120b",
                "voice": "en-US-GuyNeural",
                "focus": "Distributed systems, concurrency, latency SLAs, memory/CPU trade-offs",
            },
            {
                "id": "product_manager",
                "persona": "Sarah",
                "model": "openai/gpt-oss-120b",
                "voice": "en-US-JennyNeural",
                "focus": "Business ROI, customer journeys, user retention, roadmap trade-offs",
            },
            {
                "id": "hiring_manager",
                "persona": "Jordan",
                "model": "openai/gpt-oss-120b",
                "voice": "en-US-BrianNeural",
                "focus": "Engineering culture, ownership under ambiguity, cross-functional conflict, accountability",
            },
            {
                "id": "coordinator",
                "role": "Dynamic speaker handoff evaluation, rotational fairness, adaptive difficulty stepper (1-5)",
            },
        ],
        "edges": [
            {"from": "START", "to": "auditor"},
            {"from": "auditor", "to": "conditional_route (active_persona)"},
            {"from": "conditional_route", "to": ["tech_lead", "product_manager", "hiring_manager"]},
            {"from": "tech_lead", "to": "coordinator"},
            {"from": "product_manager", "to": "coordinator"},
            {"from": "hiring_manager", "to": "coordinator"},
            {"from": "coordinator", "to": "END"},
        ],
    }
