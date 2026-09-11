from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel

from ..services.gemini_service import (
    CandidateProfile,
    ContradictionResult,
    EvidenceScoreReport,
    RoleCompetencyPack,
    gemini_service,
)

logger = logging.getLogger("personapanel.routes_ingest")
router = APIRouter(prefix="/api/ingest", tags=["Ingest & Audit"])


# -----------------------------------------------------------------------------
# Request Schemas
# -----------------------------------------------------------------------------

class JDParseRequest(BaseModel):
    jd_text: str


class ContradictionCheckRequest(BaseModel):
    current_answer: str
    session_history: List[Dict[str, Any]] = []
    resume_claims: List[str] = []


class ScoreTranscriptRequest(BaseModel):
    transcript: List[Dict[str, Any]]
    role_pack: Dict[str, Any]


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@router.post(
    "/resume",
    response_model=CandidateProfile,
    summary="Parse Candidate Resume",
    description="Extracts candidate profile, core technologies, and verifiable project claims via Gemini.",
)
async def parse_resume_endpoint(
    file: Optional[UploadFile] = File(default=None),
    raw_text: Optional[str] = Form(default=None),
) -> CandidateProfile:
    """
    Parses an uploaded PDF/Doc resume or raw text string into a structured CandidateProfile.
    """
    try:
        if file is not None:
            content = await file.read()
            mime_type = file.content_type or "application/pdf"
            logger.info("Parsing resume file %s (%d bytes, %s)", file.filename, len(content), mime_type)
            return await gemini_service.parse_resume(content, mime_type=mime_type)
        elif raw_text and raw_text.strip():
            logger.info("Parsing resume from raw text string (%d chars)", len(raw_text))
            return await gemini_service.parse_resume(raw_text.encode("utf-8"), mime_type="text/plain")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either an uploaded file or raw_text form parameter must be provided.",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in parse_resume_endpoint: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume parsing failed: {str(e)}",
        )


@router.post(
    "/jd",
    response_model=RoleCompetencyPack,
    summary="Parse Job Description",
    description="Decomposes job description into technical competencies, product ROI metrics, and behavioral rubric.",
)
async def parse_jd_endpoint(request: JDParseRequest) -> RoleCompetencyPack:
    """
    Parses raw Job Description text into a structured RoleCompetencyPack.
    """
    if not request.jd_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="jd_text field cannot be empty.",
        )
    try:
        return await gemini_service.parse_job_description(request.jd_text)
    except Exception as e:
        logger.error("Error in parse_jd_endpoint: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job description parsing failed: {str(e)}",
        )


@router.post(
    "/contradiction",
    response_model=ContradictionResult,
    summary="Real-Time Contradiction Detection",
    description="Evaluates whether the candidate's latest response contradicts prior dialogue turns or resume claims.",
)
async def check_contradiction_endpoint(
    request: ContradictionCheckRequest,
) -> ContradictionResult:
    try:
        result = await gemini_service.detect_contradictions(
            current_answer=request.current_answer,
            session_history=request.session_history,
            resume_claims=request.resume_claims,
        )
        return ContradictionResult(**result)
    except Exception as e:
        logger.error("Error in check_contradiction_endpoint: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Contradiction detection failed: {str(e)}",
        )


@router.post(
    "/score",
    response_model=EvidenceScoreReport,
    summary="Post-Interview Evidence Extraction & Scoring",
    description="Parses full transcript post-interview, generates quotation evidence matrix and dimension scores.",
)
async def score_interview_endpoint(
    request: ScoreTranscriptRequest,
) -> EvidenceScoreReport:
    try:
        report = await gemini_service.extract_evidence_and_score(
            transcript=request.transcript,
            role_pack=request.role_pack,
        )
        return EvidenceScoreReport(**report)
    except Exception as e:
        logger.error("Error in score_interview_endpoint: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scoring extraction failed: {str(e)}",
        )
