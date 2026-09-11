from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, Dict, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..orchestration.graph import execute_interview_turn
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

                    # Notify client AI is processing
                    context = await session_manager.get_full_session_context(session_id)
                    current_persona = context.get("current_persona", "alex")
                    await websocket.send_json({
                        "event": "AI_THINKING",
                        "persona": current_persona,
                    })

                    # Execute full LangGraph multi-agent workflow
                    turn_result = await execute_interview_turn(
                        session_id=session_id,
                        candidate_text=candidate_text,
                        synthesize_voice=False,  # Cancellable streaming managed below
                    )

                    speaker_persona = turn_result.get("speaker", current_persona)
                    response_text = turn_result.get("text", "")
                    handoff_decision = turn_result.get("handoff", {})
                    contradiction = turn_result.get("contradiction")
                    new_difficulty = turn_result.get("difficulty_level", 3)

                    # 1. Dispatch Contradiction alert if detected
                    if contradiction and contradiction.get("contradiction_detected"):
                        await websocket.send_json({
                            "event": "CONTRADICTION_DETECTED",
                            "session_id": session_id,
                            "contradiction": contradiction,
                            "timestamp": time.time(),
                        })

                    # 2. Dispatch Adaptive Difficulty update
                    await websocket.send_json({
                        "event": "DIFFICULTY_UPDATED",
                        "session_id": session_id,
                        "difficulty_level": new_difficulty,
                        "delta": handoff_decision.get("difficulty_delta", 0),
                        "timestamp": time.time(),
                    })

                    # 3. Dispatch AI Turn Start
                    await websocket.send_json({
                        "event": "AI_TURN_START",
                        "session_id": session_id,
                        "persona": speaker_persona,
                        "text": response_text,
                        "handoff": handoff_decision.get("next_persona") if handoff_decision.get("handoff_occurred") else None,
                        "timestamp": time.time(),
                    })

                    # 4. Voice Synthesis & Audio Streaming via Edge-TTS
                    async def stream_tts():
                        conn_state.is_ai_speaking = True
                        try:
                            # Generate base64 audio payload for the browser client
                            audio_b64 = await tts_service.synthesize_to_base64(
                                text=response_text,
                                persona=speaker_persona,
                            )

                            if audio_b64 and conn_state.is_ai_speaking:
                                await websocket.send_json({
                                    "event": "AUDIO_RESPONSE",
                                    "session_id": session_id,
                                    "persona": speaker_persona,
                                    "audio": audio_b64,
                                    "mime_type": "audio/mp3",
                                    "timestamp": time.time(),
                                })

                            if conn_state.is_ai_speaking:
                                await websocket.send_json({
                                    "event": "AI_TURN_END",
                                    "session_id": session_id,
                                    "persona": speaker_persona,
                                    "timestamp": time.time(),
                                })
                        except asyncio.CancelledError:
                            logger.info("TTS playback cancelled due to candidate interruption.")
                        except Exception as te:
                            logger.error("TTS generation error: %s", te)
                        finally:
                            conn_state.is_ai_speaking = False

                    conn_state.active_tts_task = asyncio.create_task(stream_tts())

                    # 5. Dispatch Speaker Handoff if occurred
                    if handoff_decision.get("handoff_occurred"):
                        await websocket.send_json({
                            "event": "SPEAKER_HANDOFF",
                            "session_id": session_id,
                            "previous_persona": handoff_decision.get("previous_persona", speaker_persona),
                            "new_persona": handoff_decision.get("next_persona"),
                            "reason": handoff_decision.get("reason"),
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
