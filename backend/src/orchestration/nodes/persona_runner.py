from __future__ import annotations

import logging
import re
import time
from typing import Any, Dict, Optional, Tuple

from ...services.groq_service import groq_service
from ..prompts import build_persona_messages
from ..state import InterviewState, SpeakerOutput

logger = logging.getLogger("personapanel.orchestration.persona_runner")


def parse_handoff_tag(text: str) -> Tuple[str, Optional[str]]:
    """
    Extracts [HANDOFF: TARGET] from generated text.
    Normalizes target to 'alex', 'sarah', or 'jordan'.
    Returns (cleaned_text, target_persona_or_None).
    """
    match = re.search(r"\[HANDOFF:\s*([A-Z_]+)\]", text, re.IGNORECASE)
    handoff_target: Optional[str] = None
    cleaned = text

    if match:
        raw_target = match.group(1).upper()
        cleaned = re.sub(r"\[HANDOFF:\s*([A-Z_]+)\]", "", text).strip()

        if "TECH" in raw_target or "ALEX" in raw_target:
            handoff_target = "alex"
        elif "PRODUCT" in raw_target or "SARAH" in raw_target or "PM" in raw_target:
            handoff_target = "sarah"
        elif "HIRING" in raw_target or "JORDAN" in raw_target or "LEAD" in raw_target:
            handoff_target = "jordan"

    return cleaned, handoff_target


async def execute_persona_turn(
    persona: str,
    state: InterviewState,
) -> SpeakerOutput:
    """
    Executes a turn for a specific persona using Groq (openai/gpt-oss-120b).
    Enforces 2-sentence conciseness, role-specific probing, and handoff tag extraction.
    """
    norm_persona = persona.lower().strip()
    candidate_text = state.get("candidate_text", "").strip()
    candidate_profile = state.get("candidate_profile", {})
    history = state.get("turns_history", [])
    claims = state.get("verified_claims", [])
    difficulty = state.get("difficulty_level", 3)
    contradiction_alert = state.get("contradiction_alert")

    messages = build_persona_messages(
        persona=norm_persona,
        candidate_text=candidate_text,
        candidate_profile=candidate_profile,
        recent_turns=history,
        claims=claims,
        difficulty_level=difficulty,
        contradiction_alert=contradiction_alert,
    )

    client = groq_service.client
    model_name = groq_service.chat_model or "openai/gpt-oss-120b"

    raw_response: str = ""
    if groq_service.settings.groq_api_key:
        try:
            completion = await client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.35,
                max_tokens=150,
            )
            raw_response = completion.choices[0].message.content or ""
        except Exception as e:
            logger.warning(
                "Primary model (%s) failed for persona '%s': %s. Trying fallback model...",
                model_name,
                norm_persona,
                e,
            )
            # Try resilient fallback model
            try:
                completion = await client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    temperature=0.35,
                    max_tokens=150,
                )
                raw_response = completion.choices[0].message.content or ""
            except Exception as e2:
                logger.error("Fallback Groq model failed: %s", e2)
                raw_response = ""

    if not raw_response:
        # High fidelity contextual fallback
        if norm_persona == "sarah":
            raw_response = (
                "How does this technical decision impact our end-user conversion and unit margins? "
                "Can you walk me through the trade-offs you presented to business stakeholders? [HANDOFF: HIRING_MANAGER]"
            )
        elif norm_persona == "jordan":
            raw_response = (
                "When your team experienced architectural friction around this initiative, how did you drive consensus? "
                "Describe a situation where you had to compromise on your technical preference."
            )
        else:
            raw_response = (
                "How did you guarantee data consistency during network partitions in that setup? "
                "Walk me through your leader election timeout configuration. [HANDOFF: PRODUCT_MANAGER]"
            )

    cleaned_text, handoff_target = parse_handoff_tag(raw_response)

    output: SpeakerOutput = {
        "persona": norm_persona,
        "raw_text": raw_response.strip(),
        "cleaned_text": cleaned_text.strip(),
        "handoff": handoff_target,
        "timestamp": time.time(),
    }
    return output
