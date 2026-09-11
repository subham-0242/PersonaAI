from __future__ import annotations

import base64
import io
import logging
import re
from typing import Any, Dict, Optional, Tuple
from groq import AsyncGroq

from ..config import get_settings

logger = logging.getLogger("personapanel.groq_service")


# =============================================================================
# Persona System Prompts
# =============================================================================

PERSONA_PROMPTS = {
    "alex": """You are Alex, a Principal Systems Architect & Tech Lead on a multi-agent interview panel.
Your focus: Deep technical architecture, concurrency models, distributed data consistency, latency SLAs, memory/compute trade-offs, and failure mode analysis.
Rules:
1. Speak in a sharp, conversational, direct peer-level tone.
2. Max 2 concise sentences per turn. Never monologue or give lectures.
3. Probe directly on implementation details, edge cases, and architectural justification.
4. If the candidate provides a technically viable architecture but ignores business ROI, unit cost, or product trade-offs, append [HANDOFF: PRODUCT_MANAGER] at the very end of your response.
5. If the technical depth is satisfied and you want behavioral/leadership validation, you may append [HANDOFF: HIRING_MANAGER].""",

    "sarah": """You are Sarah, a Group Product Manager on an executive interview panel.
Your focus: Business outcomes, customer value journeys, ROI unit economics, trade-off prioritization, user retention, and delivery timelines.
Rules:
1. Speak in an inquisitive, pragmatic, strategic product leader tone.
2. Max 2 concise sentences per turn. Never monologue.
3. Question how technical choices impact users, conversion, operating margins, or feature delivery.
4. If the candidate's answer reveals deep unverified architectural complexity that needs systems audit, append [HANDOFF: TECH_LEAD] at the end.
5. If you want to evaluate leadership, stakeholder conflict, or ownership, append [HANDOFF: HIRING_MANAGER].""",

    "jordan": """You are Jordan, the VP of Engineering / Hiring Manager on the panel.
Your focus: Engineering culture, ownership under ambiguity, cross-functional conflict, blameless accountability, and communication clarity.
Rules:
1. Speak in a balanced, empathetic, yet rigorous executive leader tone.
2. Max 2 concise sentences per turn. Never monologue.
3. Drill into how the candidate influenced team decisions, dealt with friction, or owned failures.
4. If you want deeper technical probing on an incident, append [HANDOFF: TECH_LEAD].
5. If you want product prioritization probing, append [HANDOFF: PRODUCT_MANAGER].""",
}


class GroqService:
    """
    Dialogue generation via Groq LLaMA 3.3 70B and STT via Whisper Large v3.
    """

    def __init__(self):
        self.settings = get_settings()
        self._client: Optional[AsyncGroq] = None
        self.chat_model = self.settings.groq_chat_model or "openai/gpt-oss-120b"
        self.whisper_model = "whisper-large-v3"

    @property
    def client(self) -> AsyncGroq:
        if self._client is None:
            api_key = self.settings.groq_api_key or ""
            if not api_key:
                logger.warning("GROQ_API_KEY is not set. Groq client running in simulated fallback mode.")
            self._client = AsyncGroq(api_key=api_key)
        return self._client

    # -------------------------------------------------------------------------
    # 1. Speech-to-Text (Whisper Large v3)
    # -------------------------------------------------------------------------
    async def transcribe_audio_chunk(
        self, audio_input: bytes | str, filename: str = "audio.wav"
    ) -> str:
        """
        Transcribes incoming audio bytes or base64 chunk using Groq's whisper-large-v3 model.
        """
        raw_bytes: bytes
        if isinstance(audio_input, str):
            # Clean up potential data URI header
            if "base64," in audio_input:
                audio_input = audio_input.split("base64,")[1]
            try:
                raw_bytes = base64.b64decode(audio_input)
            except Exception as e:
                logger.error("Failed to decode base64 audio: %s", e)
                return ""
        else:
            raw_bytes = audio_input

        if not raw_bytes or len(raw_bytes) < 100:
            return ""

        if not self.settings.groq_api_key:
            logger.info("Transcribe simulated (no GROQ_API_KEY set).")
            return "I designed a distributed consensus layer with multi-Raft to keep write latency under 5 milliseconds."

        try:
            audio_buffer = io.BytesIO(raw_bytes)
            audio_buffer.name = filename

            transcription = await self.client.audio.transcriptions.create(
                file=(filename, audio_buffer, "audio/wav"),
                model=self.whisper_model,
                language="en",
                response_format="json",
                temperature=0.0,
            )
            return transcription.text.strip()
        except Exception as e:
            logger.error("Groq Whisper transcription error: %s", e)
            return ""

    # -------------------------------------------------------------------------
    # 2. Dialogue Generation (LLaMA 3.3 70B Versatile)
    # -------------------------------------------------------------------------
    async def generate_panelist_turn(
        self,
        persona: str,
        candidate_text: str,
        session_context: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Executes real-time conversational response from active panelist.
        Enforces:
        - Max 2 concise sentences
        - Conversational tone, direct probing
        - Tag-based speaker handoffs [HANDOFF: PERSONA]
        - LLaMA 3.3 70B with temperature=0.4, max_tokens=150
        """
        norm_persona = persona.lower().strip()
        if norm_persona not in PERSONA_PROMPTS:
            norm_persona = "alex"

        system_instruction = PERSONA_PROMPTS[norm_persona]
        difficulty = session_context.get("difficulty_level", 3)
        candidate_profile = session_context.get("candidate_profile", {})
        candidate_name = candidate_profile.get("candidate_name", "Candidate")
        recent_turns = session_context.get("recent_turns", [])
        claims = session_context.get("claims", [])

        # Build message history for conversational continuity
        messages = [
            {"role": "system", "content": system_instruction},
            {
                "role": "system",
                "content": (
                    f"Interview Context:\n"
                    f"- Candidate: {candidate_name}\n"
                    f"- Current Difficulty: {difficulty}/5 (1=Basic, 3=Senior, 5=Staff/Principal Stress Test)\n"
                    f"- Verified Claims to probe or challenge: {', '.join(claims[:3]) if claims else 'None recorded yet.'}"
                ),
            },
        ]

        for turn in recent_turns[-4:]:
            role = "user" if turn.get("speaker") == "candidate" else "assistant"
            prefix = ""
            if role == "assistant":
                prefix = f"[{turn.get('persona', 'Alex').capitalize()}]: "
            messages.append({"role": role, "content": f"{prefix}{turn.get('text', '')}"})

        # Append candidate's latest response
        messages.append({"role": "user", "content": candidate_text.strip()})

        if not self.settings.groq_api_key:
            # High-fidelity realistic fallback responses
            if norm_persona == "alex":
                fallback_text = (
                    "How did you guarantee data consistency during network partitions in that multi-Raft setup? "
                    "Walk me through your leader election timeout configuration. [HANDOFF: PRODUCT_MANAGER]"
                )
            elif norm_persona == "sarah":
                fallback_text = (
                    "That p99 improvement sounds solid, but how did that translate into conversion or customer retention? "
                    "Did the business justify the infrastructure cost? [HANDOFF: HIRING_MANAGER]"
                )
            else:
                fallback_text = (
                    "When the team disagreed on this architectural direction, how did you build alignment across disciplines? "
                    "Tell me about a trade-off you personally had to concede."
                )
            cleaned_text, handoff = self._parse_handoff(fallback_text)
            return {
                "text": fallback_text,
                "cleaned_text": cleaned_text,
                "persona": norm_persona,
                "handoff": handoff,
            }

        try:
            chat_completion = await self.client.chat.completions.create(
                model=self.chat_model,
                messages=messages,
                temperature=0.4,
                max_tokens=150,
            )
            raw_response = chat_completion.choices[0].message.content or ""
            cleaned_text, handoff = self._parse_handoff(raw_response)

            return {
                "text": raw_response.strip(),
                "cleaned_text": cleaned_text,
                "persona": norm_persona,
                "handoff": handoff,
            }
        except Exception as e:
            logger.error("Groq LLaMA 3.3 chat generation failed: %s", e)
            fallback = "Could you elaborate on the core trade-offs you made in that scenario?"
            return {
                "text": fallback,
                "cleaned_text": fallback,
                "persona": norm_persona,
                "handoff": None,
            }

    # -------------------------------------------------------------------------
    # Helper: Handoff Tag Extraction
    # -------------------------------------------------------------------------
    def _parse_handoff(self, text: str) -> Tuple[str, Optional[str]]:
        """
        Detects [HANDOFF: TARGET_ROLE] tags in generated text,
        normalizes target role to 'alex', 'sarah', or 'jordan',
        and strips the bracketed tag for speech synthesis.
        """
        match = re.search(r"\[HANDOFF:\s*([A-Z_]+)\]", text, re.IGNORECASE)
        handoff_target = None
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


# Singleton instance
groq_service = GroqService()
