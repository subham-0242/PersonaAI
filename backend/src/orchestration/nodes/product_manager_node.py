from __future__ import annotations

import logging
from typing import Any, Dict

from ..state import InterviewState
from .persona_runner import execute_persona_turn

logger = logging.getLogger("personapanel.orchestration.product_manager")


async def product_manager_node(state: InterviewState) -> Dict[str, Any]:
    """
    Product Manager Node (Sarah):
    Focus: Business value, ROI metrics, customer impact, roadmap prioritization, user retention.
    """
    logger.info("Executing Product Manager (Sarah) node for session %s", state.get("session_id"))
    output = await execute_persona_turn("sarah", state)
    return {
        "current_speaker_output": output,
        "active_persona": "sarah",
        "phase": "product_manager_turn_complete",
    }
