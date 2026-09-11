from __future__ import annotations

import logging
import re
from typing import Any, Dict

from ...services.gemini_service import gemini_service
from ..state import InterviewState

logger = logging.getLogger("personapanel.orchestration.auditor")


async def auditor_node(state: InterviewState) -> Dict[str, Any]:
    """
    Auditor Node:
    Uses Gemini (gemini-2.0-flash) to evaluate candidate's spoken answer in real time:
    1. Cross-references against verified resume claims & dialogue history.
    2. Identifies factual contradictions or ungrounded technical metrics.
    3. Detects newly stated verifiable claims to track in session memory.
    """
    candidate_text = state.get("candidate_text", "").strip()
    history = state.get("turns_history", [])
    verified_claims = list(state.get("verified_claims", []))

    if not candidate_text:
        return {
            "contradiction_alert": None,
            "phase": "audited",
        }

    contradiction_result = None
    try:
        # Audit for contradictions
        res = await gemini_service.detect_contradictions(
            current_answer=candidate_text,
            session_history=history,
            resume_claims=verified_claims,
        )
        if res.get("contradiction_detected"):
            logger.warning(
                "Contradiction detected in session %s: %s",
                state.get("session_id"),
                res.get("explanation"),
            )
            contradiction_result = res
    except Exception as e:
        logger.error("Error during auditor contradiction evaluation: %s", e)
        contradiction_result = None

    # Lightweight extraction of newly stated metrics or high-value claims
    # e.g., numbers with units like "50ms", "10k RPS", "99.99%", "$2M", etc.
    metric_matches = re.findall(
        r"\b(?:\d+(?:\.\d+)?\s*(?:%|ms|seconds|minutes|k|m|million|billion|rps|qps|tb|gb))\b",
        candidate_text,
        re.IGNORECASE,
    )
    if metric_matches and len(candidate_text.split()) > 6:
        # Construct a candidate claim snippet
        claim_snippet = candidate_text[:140].strip()
        if claim_snippet not in verified_claims:
            verified_claims.append(claim_snippet)

    return {
        "contradiction_alert": contradiction_result,
        "verified_claims": verified_claims,
        "phase": "audited",
    }
