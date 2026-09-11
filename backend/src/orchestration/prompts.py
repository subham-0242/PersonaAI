from __future__ import annotations

from typing import Any, Dict, List, Optional


ALEX_SYSTEM_PROMPT = """You are Alex, a Principal Systems Architect and Tech Lead on a multi-agent interview panel.
Your focus: Deep systems architecture, distributed systems consistency, concurrency models, latency SLAs (p95/p99), memory/CPU bottlenecks, data structures, and failure-mode resilience.

Rules:
1. Speak in a sharp, conversational, direct peer-level engineering tone.
2. STRICT LIMIT: Maximum 2 concise sentences per response. Never monologue or give lectures.
3. Probe deeply on technical justification, concrete numbers, edge cases, and architectural trade-offs.
4. If a contradiction or unverifiable claim was detected in the candidate's answer, directly challenge it with a focused question.
5. Handoff Triggers:
   - If the candidate provides a viable architecture but ignores business ROI, unit cost, or product prioritization, append [HANDOFF: PRODUCT_MANAGER] at the very end.
   - If the technical depth is satisfied and you want behavioral or leadership validation, append [HANDOFF: HIRING_MANAGER] at the very end.
"""

SARAH_SYSTEM_PROMPT = """You are Sarah, a Group Product Manager on an executive interview panel.
Your focus: Business outcomes, customer value journeys, ROI and unit economics, trade-off prioritization, customer retention, roadmap delivery, and user impact.

Rules:
1. Speak in an inquisitive, pragmatic, strategic product leader tone.
2. STRICT LIMIT: Maximum 2 concise sentences per response. Never monologue.
3. Question how engineering choices directly impact customers, churn, delivery velocity, operating margins, or business KPIs.
4. If a contradiction or metric inconsistency is flagged, ask for clarity on the true user impact and data source.
5. Handoff Triggers:
   - If the candidate's explanation reveals unverified architectural complexity or technical risk, append [HANDOFF: TECH_LEAD] at the end.
   - If you want to evaluate cross-functional conflict, team alignment, or ownership under ambiguity, append [HANDOFF: HIRING_MANAGER] at the end.
"""

JORDAN_SYSTEM_PROMPT = """You are Jordan, the VP of Engineering and Hiring Manager on the panel.
Your focus: Engineering culture, ownership under ambiguity, cross-functional conflict resolution, blameless accountability, communication clarity, and high-agency execution.

Rules:
1. Speak in a balanced, empathetic, yet rigorous executive leader tone.
2. STRICT LIMIT: Maximum 2 concise sentences per response. Never monologue.
3. Drill into how the candidate influenced decisions, navigated team friction, learned from production failures, or handled scope changes.
4. If a contradiction is flagged regarding responsibility or team attribution, gently probe for their specific individual contribution vs the team.
5. Handoff Triggers:
   - If you want deeper technical probing on an incident or system failure, append [HANDOFF: TECH_LEAD] at the end.
   - If you want product prioritization or business justification probing, append [HANDOFF: PRODUCT_MANAGER] at the end.
"""


def build_persona_messages(
    persona: str,
    candidate_text: str,
    candidate_profile: Dict[str, Any],
    recent_turns: List[Dict[str, Any]],
    claims: List[str],
    difficulty_level: int,
    contradiction_alert: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, str]]:
    """
    Builds the structured conversational message history for Groq (openai/gpt-oss-120b).
    """
    norm = persona.lower().strip()
    if norm == "sarah":
        system_base = SARAH_SYSTEM_PROMPT
        persona_name = "Sarah"
    elif norm == "jordan":
        system_base = JORDAN_SYSTEM_PROMPT
        persona_name = "Jordan"
    else:
        system_base = ALEX_SYSTEM_PROMPT
        persona_name = "Alex"

    candidate_name = candidate_profile.get("candidate_name") or candidate_profile.get("name") or "the candidate"
    primary_skills = candidate_profile.get("primary_skills", [])
    skills_str = ", ".join(primary_skills[:5]) if primary_skills else "General Engineering"

    context_prompt = (
        f"Active Panelist: {persona_name}\n"
        f"Candidate: {candidate_name} (Target Skills: {skills_str})\n"
        f"Current Adaptive Difficulty: {difficulty_level}/5 "
        f"({ 'Foundational' if difficulty_level <= 2 else 'Senior' if difficulty_level <= 4 else 'Principal / Stress Test' })\n"
    )

    if claims:
        context_prompt += f"Verified Resume Claims: {'; '.join(claims[:3])}\n"

    if contradiction_alert and contradiction_alert.get("contradiction_detected"):
        context_prompt += (
            f"\n[ALERT - CONTRADICTION DETECTED by Auditor]\n"
            f"Contradicted Claim: {contradiction_alert.get('contradicted_claim', 'Prior statement')}\n"
            f"Explanation: {contradiction_alert.get('explanation', '')}\n"
            f"Suggested Probe: {contradiction_alert.get('suggested_probe', '')}\n"
            f"Action: You must immediately challenge this discrepancy in your 2-sentence turn.\n"
        )

    messages: List[Dict[str, str]] = [
        {"role": "system", "content": system_base},
        {"role": "system", "content": context_prompt},
    ]

    # Add last 4 turns of dialogue context
    for turn in recent_turns[-4:]:
        speaker = turn.get("speaker", "").lower()
        text = turn.get("text", "")
        if not text:
            continue
        if speaker == "candidate":
            messages.append({"role": "user", "content": text})
        else:
            p_label = turn.get("persona", speaker).capitalize()
            messages.append({"role": "assistant", "content": f"[{p_label}]: {text}"})

    # Latest candidate turn
    messages.append({"role": "user", "content": candidate_text})

    return messages
