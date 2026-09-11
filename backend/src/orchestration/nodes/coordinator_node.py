from __future__ import annotations

import logging
from typing import Any, Dict

from ..state import HandoffDecision, InterviewState

logger = logging.getLogger("personapanel.orchestration.coordinator")


def calculate_difficulty_adjustment(
    current_level: int,
    candidate_text: str,
    contradiction_alert: Any,
) -> int:
    """
    Computes dynamic difficulty adjustment (-1, 0, or +1).
    - If contradiction flagged: increase pressure to stress-test claims (+1)
    - If answer provides strong concrete architectural depth (>40 words, technical keywords): (+1)
    - If answer is very brief (<8 words) or lacks substance: (-1)
    - Range is clamped between 1 and 5.
    """
    delta = 0
    words = candidate_text.split()
    word_count = len(words)

    if contradiction_alert and contradiction_alert.get("contradiction_detected"):
        delta += 1
    elif word_count > 45:
        # Check for deep technical or business rigor indicators
        tech_indicators = [
            "latency", "concurrency", "consistency", "trade-off", "partition",
            "sharding", "throughput", "p99", "sla", "roi", "churn", "margin",
            "metric", "cache", "async", "consensus", "bottleneck"
        ]
        text_lower = candidate_text.lower()
        matches = sum(1 for kw in tech_indicators if kw in text_lower)
        if matches >= 2:
            delta += 1
    elif word_count < 8:
        delta -= 1

    new_level = max(1, min(5, current_level + delta))
    return new_level


async def coordinator_node(state: InterviewState) -> Dict[str, Any]:
    """
    Coordinator & Dynamic Handoff Node:
    1. Evaluates persona response for handoff tags or rotational fairness.
    2. Calculates adaptive difficulty step (levels 1-5).
    3. Emits structured HandoffDecision and prepares next active persona.
    """
    current_output = state.get("current_speaker_output", {})
    speaker_persona = current_output.get("persona") or state.get("active_persona", "alex")
    handoff_target = current_output.get("handoff")
    current_difficulty = state.get("difficulty_level", 3)
    candidate_text = state.get("candidate_text", "")
    contradiction_alert = state.get("contradiction_alert")

    # Evaluate Handoff
    handoff_occurred = False
    next_persona = speaker_persona
    reason = "Panelist retains floor for follow-up probe."

    if handoff_target and handoff_target != speaker_persona:
        handoff_occurred = True
        next_persona = handoff_target
        reason = f"Explicit handoff triggered by {speaker_persona.capitalize()} to {next_persona.capitalize()}."
    else:
        # Rotational fairness check: count consecutive turns by current persona
        history = state.get("turns_history", [])
        consecutive = 0
        for turn in reversed(history):
            if turn.get("speaker") == speaker_persona:
                consecutive += 1
            else:
                break
        if consecutive >= 2:
            # Soft handoff rotation
            rotation_map = {"alex": "sarah", "sarah": "jordan", "jordan": "alex"}
            next_persona = rotation_map.get(speaker_persona, "alex")
            handoff_occurred = True
            reason = f"Automated panel rotation: floor passed from {speaker_persona.capitalize()} to {next_persona.capitalize()}."

    # Dynamic Difficulty Computation
    updated_difficulty = calculate_difficulty_adjustment(
        current_level=current_difficulty,
        candidate_text=candidate_text,
        contradiction_alert=contradiction_alert,
    )
    difficulty_delta = updated_difficulty - current_difficulty

    decision: HandoffDecision = {
        "handoff_occurred": handoff_occurred,
        "previous_persona": speaker_persona,
        "next_persona": next_persona,
        "reason": reason,
        "difficulty_delta": difficulty_delta,
        "updated_difficulty": updated_difficulty,
    }

    logger.info(
        "Coordinator decision for session %s: Handoff=%s (%s -> %s), Difficulty=%d (%+d)",
        state.get("session_id"),
        handoff_occurred,
        speaker_persona,
        next_persona,
        updated_difficulty,
        difficulty_delta,
    )

    return {
        "handoff_decision": decision,
        "previous_persona": speaker_persona,
        "active_persona": next_persona,
        "difficulty_level": updated_difficulty,
        "phase": "turn_concluded",
    }
