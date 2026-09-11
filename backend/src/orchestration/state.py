from __future__ import annotations

from typing import Any, Dict, List, Optional, TypedDict


class SpeakerOutput(TypedDict, total=False):
    persona: str
    raw_text: str
    cleaned_text: str
    handoff: Optional[str]
    audio_b64: Optional[str]
    timestamp: float


class HandoffDecision(TypedDict, total=False):
    handoff_occurred: bool
    previous_persona: str
    next_persona: str
    reason: str
    difficulty_delta: int
    updated_difficulty: int


class InterviewState(TypedDict, total=False):
    session_id: str
    candidate_text: str
    active_persona: str  # 'alex' | 'sarah' | 'jordan'
    previous_persona: Optional[str]
    turn_index: int
    turns_history: List[Dict[str, Any]]
    candidate_profile: Dict[str, Any]
    role_pack: Dict[str, Any]
    verified_claims: List[str]
    contradiction_alert: Optional[Dict[str, Any]]
    difficulty_level: int  # 1 to 5
    current_speaker_output: SpeakerOutput
    handoff_decision: HandoffDecision
    error: Optional[str]
    phase: str


def create_initial_state(
    session_id: str,
    candidate_text: str,
    active_persona: str = "alex",
    turn_index: int = 1,
    turns_history: Optional[List[Dict[str, Any]]] = None,
    candidate_profile: Optional[Dict[str, Any]] = None,
    role_pack: Optional[Dict[str, Any]] = None,
    verified_claims: Optional[List[str]] = None,
    difficulty_level: int = 3,
) -> InterviewState:
    """Helper to initialize a well-formed InterviewState dictionary."""
    return {
        "session_id": session_id,
        "candidate_text": candidate_text.strip(),
        "active_persona": active_persona.lower().strip() or "alex",
        "previous_persona": None,
        "turn_index": turn_index,
        "turns_history": turns_history or [],
        "candidate_profile": candidate_profile or {},
        "role_pack": role_pack or {},
        "verified_claims": verified_claims or [],
        "contradiction_alert": None,
        "difficulty_level": max(1, min(5, difficulty_level)),
        "current_speaker_output": {},
        "handoff_decision": {
            "handoff_occurred": False,
            "previous_persona": active_persona,
            "next_persona": active_persona,
            "reason": "Initial turn",
            "difficulty_delta": 0,
            "updated_difficulty": difficulty_level,
        },
        "error": None,
        "phase": "initialized",
    }
