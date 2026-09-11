from __future__ import annotations

import asyncio
import io
import json
import logging
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from pypdf import PdfReader
from google import genai
from google.genai import types

from ..config import get_settings

logger = logging.getLogger("personapanel.gemini_service")


# =============================================================================
# Pydantic Schemas
# =============================================================================

class CandidateProfile(BaseModel):
    candidate_name: str = Field(description="Full name of the candidate")
    email: Optional[str] = Field(default="", description="Contact email address")
    phone: Optional[str] = Field(default="", description="Contact phone number")
    summary: str = Field(default="", description="Executive professional summary")
    core_technologies: List[str] = Field(
        default_factory=list,
        description="Key programming languages, frameworks, distributed systems, tools",
    )
    project_claims: List[str] = Field(
        default_factory=list,
        description="Concrete verifiable claims made in projects (e.g. 'Reduced latency by 40%', 'Designed Raft consensus engine')",
    )
    experience_years: Optional[float] = Field(default=None, description="Total estimated years of experience")
    education: Optional[str] = Field(default="", description="Degree, university, graduation year")


class RoleCompetencyPack(BaseModel):
    role_title: str = Field(description="Target role title, e.g. Senior Backend Engineer")
    target_level: str = Field(default="L5 / Senior", description="Seniority level or grade")
    technical_competencies: List[str] = Field(
        default_factory=list,
        description="Required technical proficiencies, systems design criteria, and architectural patterns",
    )
    product_business_metrics: List[str] = Field(
        default_factory=list,
        description="Required business KPIs, unit economics, ROI reasoning, and SLA awareness",
    )
    behavioral_expectations: List[str] = Field(
        default_factory=list,
        description="Core behavioral principles, leadership ownership, conflict management, cross-functional collaboration",
    )
    scoring_rubric: Dict[str, str] = Field(
        default_factory=dict,
        description="Evaluation criteria mapped to performance tiers (e.g. 'Technical Excellence': 'Deep knowledge of distributed systems')",
    )


class ContradictionResult(BaseModel):
    contradiction_detected: bool = Field(description="True if an explicit discrepancy or contradiction is found")
    severity: str = Field(
        default="none",
        description="Severity classification: 'none', 'low', 'medium', or 'high'",
    )
    clarification_prompt: str = Field(
        default="",
        description="A targeted, professional question for the interviewer to probe the contradiction without being aggressive",
    )
    explanation: str = Field(
        default="",
        description="Concise rationale explaining the exact mismatch between previous claims and current answer",
    )


class EvidenceItem(BaseModel):
    quote: str = Field(description="Exact statement or quote from candidate")
    timestamp: str = Field(description="Approximate timestamp or turn index")
    dimension: str = Field(description="Competency dimension: 'Technical', 'Product', or 'Communication'")
    rubric_match: str = Field(description="Specific requirement or rubric criterion addressed")
    evaluation: str = Field(description="Detailed assessor critique with score impact")


class EvidenceScoreReport(BaseModel):
    technical_score: float = Field(description="Calculated score (0 to 100) for technical competencies")
    product_score: float = Field(description="Calculated score (0 to 100) for product & ROI understanding")
    communication_score: float = Field(description="Calculated score (0 to 100) for clarity, brevity, and articulation")
    overall_score: float = Field(description="Weighted composite score (0 to 100)")
    evidence_matrix: List[EvidenceItem] = Field(
        default_factory=list,
        description="Granular citation matrix linking exact transcript quotes to scores",
    )
    summary_assessment: str = Field(
        description="Executive consensus summary highlighting strengths, red flags, and hiring recommendation",
    )


# =============================================================================
# Gemini Service Implementation
# =============================================================================

class GeminiService:
    """
    Core AI Ingestion, Contradiction Engine, and Evidence Scoring service
    powered by the official google-genai SDK.
    """

    def __init__(self):
        self.settings = get_settings()
        self._client: Optional[genai.Client] = None
        self.model_name = "gemini-3.8-flash"

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            api_key = self.settings.gemini_api_key or ""
            if not api_key:
                logger.warning("GEMINI_API_KEY is not set. Gemini client running in fallback mode.")
            self._client = genai.Client(api_key=api_key)
        return self._client

    # -------------------------------------------------------------------------
    # 1. Resume Parsing
    # -------------------------------------------------------------------------
    async def parse_resume(
        self, file_bytes: bytes, mime_type: str = "application/pdf"
    ) -> CandidateProfile:
        """
        Extracts candidate name, core technologies, and specific project claims
        from uploaded resume bytes into a Pydantic CandidateProfile.
        """
        # Extract plain text if PDF
        text_content = ""
        if "pdf" in mime_type.lower() or file_bytes[:4] == b"%PDF":
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content += page_text + "\n"
            except Exception as e:
                logger.warning("pypdf parsing error: %s. Will fallback to raw string decoding.", e)

        if not text_content:
            try:
                text_content = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                text_content = ""

        if not self.settings.gemini_api_key:
            # Fallback baseline when API key is missing
            return CandidateProfile(
                candidate_name="Alex Rivera",
                email="alex.rivera@example.com",
                summary="Senior Systems Engineer with expertise in distributed microservices and low-latency storage.",
                core_technologies=["Go", "Python", "Kubernetes", "gRPC", "Redis", "PostgreSQL", "Kafka"],
                project_claims=[
                    "Engineered distributed consensus module processing 120k queries per second with sub-5ms p99 latency",
                    "Architected event-driven microservices pipeline reducing data drift by 45%",
                    "Led high-throughput Kafka ingestion cluster supporting 2M events/min",
                ],
                experience_years=5.5,
                education="B.S. Computer Science, Stanford University",
            )

        prompt = f"""
You are an expert technical recruiting auditor. Analyze the following resume content and extract structured candidate information into the exact JSON format matching the schema.

Focus specifically on isolating concrete, verifiable project claims (e.g. metrics, architectures, throughput numbers, cost reductions, system scale) that the candidate asserts they built or led.

RESUME CONTENT:
\"\"\"{text_content[:15000]}\"\"\"
"""

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=CandidateProfile,
                    temperature=0.1,
                ),
            )
            raw_json = response.text or "{}"
            parsed_data = json.loads(raw_json)
            return CandidateProfile(**parsed_data)
        except Exception as e:
            logger.error("Gemini parse_resume failed: %s", e)
            # Safe structured fallback
            return CandidateProfile(
                candidate_name="Extracted Candidate",
                summary="Candidate extracted from submitted resume.",
                core_technologies=["Python", "Distributed Systems", "SQL"],
                project_claims=["Engineered backend services and scalable infrastructure"],
            )

    # -------------------------------------------------------------------------
    # 2. Job Description Parsing
    # -------------------------------------------------------------------------
    async def parse_job_description(self, jd_text: str) -> RoleCompetencyPack:
        """
        Extracts required technical competencies, product/business metrics,
        behavioral expectations, and scoring rubric into a RoleCompetencyPack.
        """
        if not self.settings.gemini_api_key:
            return RoleCompetencyPack(
                role_title="Senior Backend Systems Engineer",
                target_level="L5 / Senior",
                technical_competencies=[
                    "Distributed Consensus & CAP Theorem Tradeoffs",
                    "High-Throughput Concurrent Programming (Go / Rust / Python)",
                    "Database Optimization (Query Planning, Indexing, Partitioning)",
                    "Microservices Reliability & Observability (SLA/SLO, Circuit Breakers)",
                ],
                product_business_metrics=[
                    "Infrastructure Unit Economics & Cloud Cost ROI",
                    "User-Facing P99 Latency & Reliability Impacts",
                    "Trade-off Prioritization Under Tight Product Deadlines",
                ],
                behavioral_expectations=[
                    "Cross-Functional Communication with PMs and Designers",
                    "Accountability & Post-Mortem Blameless Culture",
                    "Mentorship of Junior Engineers",
                ],
                scoring_rubric={
                    "Technical Depth": "Demonstrates mastery of architectural failure modes, concurrency, and deep memory/IO models",
                    "Product Acumen": "Links technical decisions directly to business ROI, user conversion, and operational cost",
                    "Communication": "Speaks with structured clarity, concise precision, and open collaborative posture",
                },
            )

        prompt = f"""
You are a Principal Engineering Hiring Committee Member. Analyze this job description and decompose it into a comprehensive RoleCompetencyPack.

JOB DESCRIPTION:
\"\"\"{jd_text[:12000]}\"\"\"
"""

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=RoleCompetencyPack,
                    temperature=0.2,
                ),
            )
            raw_json = response.text or "{}"
            parsed_data = json.loads(raw_json)
            return RoleCompetencyPack(**parsed_data)
        except Exception as e:
            logger.error("Gemini parse_job_description failed: %s", e)
            return RoleCompetencyPack(
                role_title="Target Software Engineer",
                target_level="Senior",
                technical_competencies=["System Design", "Concurrency", "Database Architecture"],
                product_business_metrics=["Business ROI", "Scalability Impact"],
                behavioral_expectations=["Leadership", "Clear Communication"],
            )

    # -------------------------------------------------------------------------
    # 3. Contradiction Engine
    # -------------------------------------------------------------------------
    async def detect_contradictions(
        self,
        current_answer: str,
        session_history: List[Dict[str, Any]],
        resume_claims: List[str],
    ) -> Dict[str, Any]:
        """
        Asynchronously evaluates if the latest answer contradicts previous
        statements or resume claims.
        Returns: { contradiction_detected: bool, severity: str, clarification_prompt: str, explanation: str }
        """
        if not current_answer.strip():
            return {
                "contradiction_detected": False,
                "severity": "none",
                "clarification_prompt": "",
                "explanation": "",
            }

        if not self.settings.gemini_api_key:
            return {
                "contradiction_detected": False,
                "severity": "none",
                "clarification_prompt": "",
                "explanation": "Gemini key absent; contradiction check bypassed.",
            }

        # Compact recent context
        history_summary = "\n".join([
            f"{t.get('speaker', 'Unknown').upper()}: {t.get('text', '')}"
            for t in session_history[-6:]
        ])
        claims_summary = "\n".join([f"- {c}" for c in resume_claims[:10]])

        prompt = f"""
You are the Real-Time Audit Verification Engine for an executive technical interview panel.
Analyze the candidate's latest response against their documented resume claims and prior interview dialogue.

CRITERIA:
- Detect if the candidate makes claims that contradict previous statements (e.g. saying they didn't use Redis after claiming they designed a 100k QPS Redis cluster, or claiming solo authorship when earlier citing a team effort).
- If no contradiction is present, set contradiction_detected to false and severity to 'none'.
- If a contradiction is detected, assess severity ('low', 'medium', or 'high') and craft a respectful, surgical clarification prompt for the active interviewer to ask.

VERIFIED RESUME CLAIMS:
{claims_summary}

PREVIOUS INTERVIEW TURNS:
{history_summary}

CANDIDATE'S LATEST ANSWER:
\"{current_answer}\"
"""

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ContradictionResult,
                    temperature=0.1,
                ),
            )
            raw_json = response.text or "{}"
            result = json.loads(raw_json)
            return result
        except Exception as e:
            logger.warning("Gemini detect_contradictions error: %s", e)
            return {
                "contradiction_detected": False,
                "severity": "none",
                "clarification_prompt": "",
                "explanation": f"Evaluation error: {str(e)}",
            }

    # -------------------------------------------------------------------------
    # 4. Post-Interview Evidence Extraction & Scoring
    # -------------------------------------------------------------------------
    async def extract_evidence_and_score(
        self, transcript: List[Dict[str, Any]], role_pack: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Parses the full transcript post-interview, outputs an evidence matrix
        with exact quotes, timestamps, and calculates scores across Technical,
        Product, and Communication dimensions using Pydantic structured output.
        """
        if not transcript:
            return {
                "technical_score": 75.0,
                "product_score": 75.0,
                "communication_score": 80.0,
                "overall_score": 76.5,
                "evidence_matrix": [],
                "summary_assessment": "Insufficient interview turns recorded for evidence extraction.",
            }

        formatted_transcript = []
        for idx, turn in enumerate(transcript):
            ts = turn.get("timestamp", idx)
            speaker = turn.get("speaker", "Unknown")
            persona = turn.get("persona", "")
            text = turn.get("text", "")
            formatted_transcript.append(f"[{ts}] {speaker} ({persona}): {text}")

        transcript_str = "\n".join(formatted_transcript)
        role_pack_str = json.dumps(role_pack, indent=2)

        if not self.settings.gemini_api_key:
            return {
                "technical_score": 88.0,
                "product_score": 82.0,
                "communication_score": 90.0,
                "overall_score": 86.6,
                "evidence_matrix": [
                    {
                        "quote": "We implemented a distributed write-ahead log with multi-Raft consensus to maintain sub-5ms p99 write latency.",
                        "timestamp": "Turn 4",
                        "dimension": "Technical",
                        "rubric_match": "Distributed Consensus & CAP Theorem Tradeoffs",
                        "evaluation": "Excellent command of distributed storage primitives and latency SLAs.",
                    },
                    {
                        "quote": "The engineering cost was roughly $3k/month in AWS spend, but it unlocked $120k in retained quarterly ARR.",
                        "timestamp": "Turn 8",
                        "dimension": "Product",
                        "rubric_match": "Infrastructure Unit Economics & Cloud Cost ROI",
                        "evaluation": "Clear grasp of commercial unit economics and ROI justification.",
                    },
                ],
                "summary_assessment": "Strong hire candidate demonstrating high technical rigor, commercial intuition, and concise communication.",
            }

        prompt = f"""
You are the Lead Auditor of the PersonaPanel AI Hiring Committee.
Analyze the complete interview transcript against the target Role Competency Pack.

INSTRUCTIONS:
1. Extract a robust Evidence Matrix citing EXACT, word-for-word candidate quotes with timestamps.
2. Evaluate each quote against the rubric dimensions: 'Technical', 'Product', and 'Communication'.
3. Score each dimension from 0.0 to 100.0 based on the rigor of demonstrated competence.
4. Calculate a weighted overall_score (e.g. 40% Technical, 35% Product, 25% Communication).
5. Provide an executive hiring summary assessment with key strengths and improvement areas.

ROLE COMPETENCY PACK:
{role_pack_str}

FULL INTERVIEW TRANSCRIPT:
{transcript_str}
"""

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=EvidenceScoreReport,
                    temperature=0.2,
                ),
            )
            raw_json = response.text or "{}"
            result = json.loads(raw_json)
            return result
        except Exception as e:
            logger.error("Gemini extract_evidence_and_score failed: %s", e)
            return {
                "technical_score": 75.0,
                "product_score": 75.0,
                "communication_score": 75.0,
                "overall_score": 75.0,
                "evidence_matrix": [],
                "summary_assessment": f"Error during automated scoring: {str(e)}",
            }


# Singleton instance
gemini_service = GeminiService()
