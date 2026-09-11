from __future__ import annotations

import logging
from typing import Any, Dict

from ..state import InterviewState
from .persona_runner import execute_persona_turn

logger = logging.getLogger("personapanel.orchestration.tech_lead")


async def tech_lead_node(state: InterviewState) -> Dict[str, Any]:
    """
    Tech Lead Node (Alex):
    Focus: Distributed systems, concurrency, low-level architecture, performance SLAs, data consistency.
    """
    logger.info("Executing Tech Lead (Alex) node for session %s", state.get("session_id"))
    output = await execute_persona_turn("alex", state)
    return {
        "current_speaker_output": output,
        "active_persona": "alex",
        "phase": "tech_lead_turn_complete",
    }
