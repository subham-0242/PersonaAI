from __future__ import annotations

import logging
from typing import Any, Dict

from ..state import InterviewState
from .persona_runner import execute_persona_turn

logger = logging.getLogger("personapanel.orchestration.hiring_manager")


async def hiring_manager_node(state: InterviewState) -> Dict[str, Any]:
    """
    Hiring Manager Node (Jordan):
    Focus: Culture fit, conflict resolution, ownership under ambiguity, leadership, engineering accountability.
    """
    logger.info("Executing Hiring Manager (Jordan) node for session %s", state.get("session_id"))
    output = await execute_persona_turn("jordan", state)
    return {
        "current_speaker_output": output,
        "active_persona": "jordan",
        "phase": "hiring_manager_turn_complete",
    }
