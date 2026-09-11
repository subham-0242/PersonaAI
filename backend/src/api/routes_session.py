from __future__ import annotations

import logging
import uuid
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from ..services.gemini_service import gemini_service
from ..services.session_context import session_manager

logger = logging.getLogger("personapanel.routes_session")
router = APIRouter(prefix="/api/session", tags=["Session Lifecycle"])


# -----------------------------------------------------------------------------
# Request & Response Models
# -----------------------------------------------------------------------------

class SessionInitRequest(BaseModel):
    session_id: Optional[str] = Field(default=None, description="Optional custom session ID, defaults to UUID4")
    candidate_profile: Optional[Dict[str, Any]] = Field(default_factory=dict)
    role_pack: Optional[Dict[str, Any]] = Field(default_factory=dict)
    initial_persona: str = Field(default="alex", description="Default starting persona: 'alex', 'sarah', or 'jordan'")
    initial_difficulty: int = Field(default=3, ge=1, le=5, description="Starting difficulty level between 1 and 5")


class PersonaSwitchRequest(BaseModel):
    persona: str = Field(description="Target persona: 'alex', 'sarah', or 'jordan'")


class DifficultyUpdateRequest(BaseModel):
    level: Optional[int] = Field(default=None, ge=1, le=5)
    delta: Optional[int] = Field(default=None, ge=-5, le=5)


class AddClaimRequest(BaseModel):
    claim: str


class AddTurnRequest(BaseModel):
    speaker: str = Field(description="'candidate' or panelist name")
    text: str
    persona: Optional[str] = None
    handoff: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@router.post(
    "/init",
    summary="Initialize Interview Session",
    description="Provisions state in Redis or resilient in-memory context for a new simulation session.",
)
async def init_session_endpoint(request: SessionInitRequest) -> Dict[str, Any]:
    session_id = request.session_id or f"sess_{uuid.uuid4().hex[:12]}"
    try:
        meta = await session_manager.init_session(
            session_id=session_id,
            candidate_profile=request.candidate_profile,
            role_pack=request.role_pack,
            initial_persona=request.initial_persona,
            initial_difficulty=request.initial_difficulty,
        )
        return {
            "status": "success",
            "session_id": session_id,
            "session_state": meta,
        }
    except Exception as e:
        logger.error("Error initializing session %s: %s", session_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Session initialization failed: {str(e)}",
        )


@router.get(
    "/{session_id}",
    summary="Get Full Session State",
    description="Returns complete session details including active persona, difficulty, turns, and claims.",
)
async def get_session_endpoint(session_id: str) -> Dict[str, Any]:
    try:
        context = await session_manager.get_full_session_context(session_id)
        return {"status": "success", "session": context}
    except Exception as e:
        logger.error("Error fetching session %s: %s", session_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch session: {str(e)}",
        )


@router.post(
    "/{session_id}/persona",
    summary="Switch Active Persona",
    description="Updates the currently questioning panelist ('alex', 'sarah', or 'jordan').",
)
async def set_persona_endpoint(
    session_id: str, request: PersonaSwitchRequest
) -> Dict[str, Any]:
    new_persona = await session_manager.set_current_persona(session_id, request.persona)
    return {
        "status": "success",
        "session_id": session_id,
        "current_persona": new_persona,
    }


@router.post(
    "/{session_id}/difficulty",
    summary="Adjust Adaptive Difficulty",
    description="Sets explicit level (1-5) or applies relative step delta.",
)
async def update_difficulty_endpoint(
    session_id: str, request: DifficultyUpdateRequest
) -> Dict[str, Any]:
    if request.level is not None:
        updated = await session_manager.set_difficulty(session_id, request.level)
    elif request.delta is not None:
        updated = await session_manager.adjust_difficulty(session_id, request.delta)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify either 'level' or 'delta'.",
        )
    return {
        "status": "success",
        "session_id": session_id,
        "difficulty_level": updated,
    }


@router.post(
    "/{session_id}/claims",
    summary="Register Verified Candidate Claim",
    description="Appends a newly stated or resume-derived claim to the session verification register.",
)
async def add_claim_endpoint(session_id: str, request: AddClaimRequest) -> Dict[str, Any]:
    await session_manager.add_claim(session_id, request.claim)
    claims = await session_manager.get_claims(session_id)
    return {
        "status": "success",
        "session_id": session_id,
        "claims_count": len(claims),
        "claims": claims,
    }


@router.post(
    "/{session_id}/turn",
    summary="Record Transcript Turn",
    description="Appends a spoken dialogue turn to the session transcript.",
)
async def record_turn_endpoint(session_id: str, request: AddTurnRequest) -> Dict[str, Any]:
    turn = await session_manager.add_turn(
        session_id=session_id,
        speaker=request.speaker,
        text=request.text,
        persona=request.persona,
        handoff=request.handoff,
        metadata=request.metadata,
    )
    return {"status": "success", "turn": turn}


@router.post(
    "/{session_id}/complete",
    summary="Complete Session & Generate Evidence Audit",
    description="Concludes active interview, runs Gemini post-interview evaluation, and generates scoring audit.",
)
async def complete_session_endpoint(session_id: str) -> Dict[str, Any]:
    try:
        await session_manager.close_session(session_id)
        turns = await session_manager.get_turns(session_id)
        role_pack = await session_manager.get_role_pack(session_id)

        # Trigger Gemini evidence extraction
        scoring_report = await gemini_service.extract_evidence_and_score(
            transcript=turns,
            role_pack=role_pack,
        )

        return {
            "status": "success",
            "session_id": session_id,
            "turn_count": len(turns),
            "scoring_report": scoring_report,
        }
    except Exception as e:
        logger.error("Error completing session %s: %s", session_id, e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete session and generate score: {str(e)}",
        )
