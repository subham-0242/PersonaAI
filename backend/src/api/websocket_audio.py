from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, Dict, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..services.gemini_service import gemini_service
from ..services.groq_service import groq_service
from ..services.session_context import session_manager
from ..services.tts_service import tts_service

logger = logging.getLogger("personapanel.websocket_audio")
router = APIRouter(tags=["WebSocket Real-Time Audio Transport"])


class ActiveConnectionState:
    def __init__(self, websocket: WebSocket, session_id: str):
        self.websocket = websocket
        self.session_id = session_id
        self.active_tts_task: Optional[asyncio.Task] = None
        self.is_ai_speaking: bool = False
        self.accumulated_candidate_text: str = ""

    def cancel_active_speech(self):
        if self.active_tts_task and not self.active_tts_task.done():
            self.active_tts_task.cancel()
            self.active_tts_task = None
        self.is_ai_speaking = False


@router.websocket("/ws/simulation/{session_id}")
async def websocket_simulation_endpoint(websocket: WebSocket, session_id: str):
    """
    Real-Time Audio Transport & Model Orchestration Core:
    - Streams candidate microphone chunks to Groq Whisper
    - Dispatches async contradiction evaluation to Gemini
    - Orchestrates multi-agent conversational turns on LLaMA 3.3 70B
    - Coordinates instant interrupt mute and low-latency Edge-TTS audio playback
    """
    await websocket.accept()
    conn_state = ActiveConnectionState(websocket, session_id)
    logger.info("WebSocket connected for session: %s", session_id)

    # Send initial connection acknowledgment
    await websocket.send_json({
        "event": "CONNECTED",
        "session_id": session_id,
        "timestamp": time.time(),
        "message": "PersonaPanel Real-Time Transport Core Ready",
    })

    try:
        while True:
            # Receive text or binary frame
            message = await websocket.receive()

            if "text" in message:
                try:
                    payload = json.loads(message["text"])
                except json.JSONDecodeError:
                    logger.warning("Invalid JSON received over WebSocket")
                    continue

                event_type = payload.get("event") or payload.get("type", "")

                # -------------------------------------------------------------
                # 1. START_STREAM: Initialize session state
                # -------------------------------------------------------------
                if event_type == "START_STREAM":
                    profile = payload.get("candidate_profile", {})
                    role_pack = payload.get("role_pack", {})
                    initial_persona = payload.get("initial_persona", "alex")
                    initial_difficulty = payload.get("initial_difficulty", 3)

                    meta = await session_manager.init_session(
                        session_id=session_id,
                        candidate_profile=profile,
                        role_pack=role_pack,
                        initial_persona=initial_persona,
                        initial_difficulty=initial_difficulty,
                    )

                    await websocket.send_json({
                        "event": "STREAM_INITIALIZED",
                        "session_id": session_id,
                        "session_meta": meta,
                        "current_persona": meta["current_persona"],
                        "difficulty_level": meta["difficulty_level"],
                    })

                # -------------------------------------------------------------
                # 2. AUDIO_CHUNK: Transcribe via Whisper Large v3
                # -------------------------------------------------------------
                elif event_type == "AUDIO_CHUNK":
                    audio_b64 = payload.get("audio", "")
                    if audio_b64:
                        transcribed_text = await groq_service.transcribe_audio_chunk(audio_b64)
                        if transcribed_text:
                            conn_state.accumulated_candidate_text += " " + transcribed_text
                            await websocket.send_json({
                                "event": "TRANSCRIPTION_CHUNK",
                                "text": transcribed_text,
                                "accumulated_text": conn_state.accumulated_candidate_text.strip(),
                                "timestamp": time.time(),
                            })

                # -------------------------------------------------------------
                # 3. INTERRUPT_SIGNAL: Immediate Voice Mute & Cancel TTS
                # -------------------------------------------------------------
                elif event_type == "INTERRUPT_SIGNAL":
                    logger.info("Interrupt received for session %s. Muting AI.", session_id)
                    conn_state.cancel_active_speech()
                    await websocket.send_json({
                        "event": "AI_MUTED",
                        "session_id": session_id,
                        "timestamp": time.time(),
                    })

                # -------------------------------------------------------------
                # 4. PROCESS_TURN: Orchestrate Contradiction, LLaMA 3.3, TTS
                # -------------------------------------------------------------
                elif event_type == "PROCESS_TURN":
                    candidate_text = payload.get("candidate_text") or conn_state.accumulated_candidate_text.strip()
                    conn_state.accumulated_candidate_text = ""  # Reset buffer

                    if not candidate_text:
                        await websocket.send_json({
                            "event": "ERROR",
                            "message": "Candidate text cannot be empty for PROCESS_TURN",
                        })
                        continue

                    # Cancel any prior voice output
                    conn_state.cancel_active_speech()

                    # Retrieve session context
                    context = await session_manager.get_full_session_context(session_id)
                    current_persona = context.get("current_persona", "alex")
                    turns_history = context.get("recent_turns", [])
                    claims = context.get("claims", [])

                    # Record Candidate Turn in session history
                    await session_manager.add_turn(
                        session_id=session_id,
                        speaker="candidate",
                        text=candidate_text,
                        persona="candidate",
                    )

                    # Step 4a: Asynchronous contradiction evaluation via Gemini
                    async def run_contradiction_check():
                        try:
                            res = await gemini_service.detect_contradictions(
                                current_answer=candidate_text,
                                session_history=turns_history,
                                resume_claims=claims,
                            )
                            if res.get("contradiction_detected"):
                                await websocket.send_json({
                                    "event": "CONTRADICTION_DETECTED",
                                    "session_id": session_id,
                                    "contradiction": res,
                                    "timestamp": time.time(),
                                })
                        except Exception as ce:
                            logger.warning("Contradiction check error: %s", ce)

                    # Fire contradiction check as background task (non-blocking)
                    asyncio.create_task(run_contradiction_check())

                    # Step 4b: Execute panelist dialogue via Groq LLaMA 3.3
                    await websocket.send_json({
                        "event": "AI_THINKING",
                        "persona": current_persona,
                    })

                    panelist_turn = await groq_service.generate_panelist_turn(
                        persona=current_persona,
                        candidate_text=candidate_text,
                        session_context=context,
                    )

                    response_text = panelist_turn.get("cleaned_text", "")
                    handoff_target = panelist_turn.get("handoff")

                    await websocket.send_json({
                        "event": "AI_TURN_START",
                        "session_id": session_id,
                        "persona": current_persona,
                        "text": response_text,
                        "handoff": handoff_target,
                        "timestamp": time.time(),
                    })

                    # Step 4c: Record AI turn
                    await session_manager.add_turn(
                        session_id=session_id,
                        speaker=current_persona,
                        text=response_text,
                        persona=current_persona,
                        handoff=handoff_target,
                    )

                    # Step 4d: Voice Synthesis & Audio Streaming via Edge-TTS
                    async def stream_tts():
                        conn_state.is_ai_speaking = True
                        try:
                            # Generate base64 audio payload for the browser client
                            audio_b64 = await tts_service.synthesize_to_base64(
                                text=response_text,
                                persona=current_persona,
                            )

                            if audio_b64 and conn_state.is_ai_speaking:
                                await websocket.send_json({
                                    "event": "AUDIO_RESPONSE",
                                    "session_id": session_id,
                                    "persona": current_persona,
                                    "audio": audio_b64,
                                    "mime_type": "audio/mp3",
                                    "timestamp": time.time(),
                                })

                            if conn_state.is_ai_speaking:
                                await websocket.send_json({
                                    "event": "AI_TURN_END",
                                    "session_id": session_id,
                                    "persona": current_persona,
                                    "timestamp": time.time(),
                                })
                        except asyncio.CancelledError:
                            logger.info("TTS playback cancelled due to candidate interruption.")
                        except Exception as te:
                            logger.error("TTS generation error: %s", te)
                        finally:
                            conn_state.is_ai_speaking = False

                    conn_state.active_tts_task = asyncio.create_task(stream_tts())

                    # Step 4e: If handoff occurred, update active persona for next turn
                    if handoff_target and handoff_target != current_persona:
                        updated_persona = await session_manager.set_current_persona(
                            session_id, handoff_target
                        )
                        await websocket.send_json({
                            "event": "SPEAKER_HANDOFF",
                            "session_id": session_id,
                            "previous_persona": current_persona,
                            "new_persona": updated_persona,
                            "timestamp": time.time(),
                        })

                # -------------------------------------------------------------
                # 5. PING / Heartbeat
                # -------------------------------------------------------------
                elif event_type in ("PING", "ping"):
                    await websocket.send_json({
                        "event": "PONG",
                        "timestamp": time.time(),
                    })

                else:
                    logger.debug("Unhandled WebSocket event: %s", event_type)

            elif "bytes" in message:
                # Raw binary audio frame from microphone
                raw_bytes = message["bytes"]
                if raw_bytes and len(raw_bytes) > 200:
                    transcribed = await groq_service.transcribe_audio_chunk(raw_bytes)
                    if transcribed:
                        conn_state.accumulated_candidate_text += " " + transcribed
                        await websocket.send_json({
                            "event": "TRANSCRIPTION_CHUNK",
                            "text": transcribed,
                            "accumulated_text": conn_state.accumulated_candidate_text.strip(),
                            "timestamp": time.time(),
                        })

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected for session: %s", session_id)
        conn_state.cancel_active_speech()
    except Exception as e:
        logger.error("Unexpected WebSocket error in session %s: %s", session_id, e)
        conn_state.cancel_active_speech()
