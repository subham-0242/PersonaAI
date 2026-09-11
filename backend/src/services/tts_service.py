from __future__ import annotations

import base64
import logging
from typing import AsyncGenerator, Dict, Optional
import edge_tts

logger = logging.getLogger("personapanel.tts_service")


# Mapping of Panelists to specific Neural Voices
PERSONA_VOICES: Dict[str, str] = {
    "alex": "en-US-GuyNeural",     # Deep analytical voice (Tech Lead)
    "sarah": "en-US-JennyNeural",  # Clear, inquisitive voice (Product Manager)
    "jordan": "en-US-BrianNeural", # Professional, balanced voice (Hiring Lead)
}


class TTSService:
    """
    Low-latency neural voice synthesis using edge-tts.
    Provides streaming and buffered MP3 generation for each panelist persona.
    """

    def __init__(self):
        self.voices = PERSONA_VOICES

    def get_voice_for_persona(self, persona: str) -> str:
        norm = persona.lower().strip()
        if "tech" in norm or "alex" in norm:
            return self.voices["alex"]
        elif "product" in norm or "pm" in norm or "sarah" in norm:
            return self.voices["sarah"]
        elif "hiring" in norm or "lead" in norm or "jordan" in norm:
            return self.voices["jordan"]
        return self.voices.get(norm, "en-US-GuyNeural")

    async def synthesize_to_bytes(
        self,
        text: str,
        persona: str = "alex",
        rate: str = "+0%",
        pitch: str = "+0Hz",
    ) -> bytes:
        """
        Synthesizes text into a complete MP3 audio byte buffer.
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            return b""

        voice = self.get_voice_for_persona(persona)
        audio_buffer = bytearray()

        try:
            communicate = edge_tts.Communicate(
                text=cleaned_text,
                voice=voice,
                rate=rate,
                pitch=pitch,
            )
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_buffer.extend(chunk["data"])
            return bytes(audio_buffer)
        except Exception as e:
            logger.error("TTS synthesis error for persona '%s' (%s): %s", persona, voice, e)
            return b""

    async def synthesize_to_base64(
        self,
        text: str,
        persona: str = "alex",
        rate: str = "+0%",
        pitch: str = "+0Hz",
    ) -> str:
        """
        Synthesizes text and returns a base64 encoded string ready for WebSocket transport.
        """
        raw_bytes = await self.synthesize_to_bytes(text, persona, rate=rate, pitch=pitch)
        if not raw_bytes:
            return ""
        return base64.b64encode(raw_bytes).decode("utf-8")

    async def stream_audio_chunks(
        self,
        text: str,
        persona: str = "alex",
        rate: str = "+0%",
        pitch: str = "+0Hz",
    ) -> AsyncGenerator[bytes, None]:
        """
        Streams raw MP3 chunks incrementally as edge-tts yields them.
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            return

        voice = self.get_voice_for_persona(persona)
        try:
            communicate = edge_tts.Communicate(
                text=cleaned_text,
                voice=voice,
                rate=rate,
                pitch=pitch,
            )
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
        except Exception as e:
            logger.error("TTS streaming error for persona '%s': %s", persona, e)


# Singleton instance
tts_service = TTSService()
