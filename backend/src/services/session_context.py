from __future__ import annotations

import json
import logging
import time
from typing import Any, Dict, List, Optional
import redis.asyncio as aioredis
from ..config import get_settings

logger = logging.getLogger("personapanel.session_context")


class SessionContextManager:
    """
    Manages session lifecycle, interview turns, candidate claims, active persona,
    and adaptive difficulty level (1-5) using Redis with an in-memory fallback.
    """

    def __init__(self, redis_url: Optional[str] = None):
        self.settings = get_settings()
        self.redis_url = redis_url or self.settings.redis_url
        self._redis_client: Optional[aioredis.Redis] = None
        self._memory_store: Dict[str, Dict[str, Any]] = {}
        self._redis_available: bool = True

    async def get_client(self) -> Optional[aioredis.Redis]:
        if self._redis_client is None and self._redis_available:
            try:
                self._redis_client = aioredis.from_url(
                    self.redis_url,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=2.0,
                    socket_timeout=2.0,
                )
                await self._redis_client.ping()
                logger.info("Connected successfully to Redis at %s", self.redis_url)
            except Exception as e:
                logger.warning(
                    "Redis connection failed (%s). Falling back to resilient in-memory session store.",
                    str(e),
                )
                self._redis_available = False
                self._redis_client = None
        return self._redis_client

    # -------------------------------------------------------------------------
    # Session Initialization & Meta
    # -------------------------------------------------------------------------
    async def init_session(
        self,
        session_id: str,
        candidate_profile: Optional[Dict[str, Any]] = None,
        role_pack: Optional[Dict[str, Any]] = None,
        initial_persona: str = "alex",
        initial_difficulty: int = 3,
    ) -> Dict[str, Any]:
        """
        Initializes Redis session keys for candidate profile, role pack, persona, and metrics.
        """
        now = time.time()
        initial_state = {
            "session_id": session_id,
            "created_at": now,
            "current_persona": initial_persona.lower(),
            "difficulty_level": max(1, min(5, initial_difficulty)),
            "active": True,
        }

        client = await self.get_client()
        if client and self._redis_available:
            try:
                meta_key = f"session:{session_id}:meta"
                await client.hset(meta_key, mapping={
                    "session_id": session_id,
                    "created_at": str(now),
                    "current_persona": initial_persona.lower(),
                    "difficulty_level": str(initial_state["difficulty_level"]),
                    "active": "1",
                })
                if candidate_profile:
                    await client.set(
                        f"session:{session_id}:profile",
                        json.dumps(candidate_profile),
                    )
                if role_pack:
                    await client.set(
                        f"session:{session_id}:role_pack",
                        json.dumps(role_pack),
                    )
                # Ensure turns list is initialized
                await client.delete(f"session:{session_id}:turns")
                await client.delete(f"session:{session_id}:claims")
                logger.info("Session %s initialized in Redis", session_id)
                return initial_state
            except Exception as e:
                logger.warning("Error writing init_session to Redis: %s. Using memory.", e)
                self._redis_available = False

        # In-Memory Fallback
        self._memory_store[session_id] = {
            "meta": initial_state,
            "profile": candidate_profile or {},
            "role_pack": role_pack or {},
            "turns": [],
            "claims": [],
        }
        logger.info("Session %s initialized in memory store", session_id)
        return initial_state

    # -------------------------------------------------------------------------
    # Turns & History
    # -------------------------------------------------------------------------
    async def add_turn(
        self,
        session_id: str,
        speaker: str,  # 'candidate' or panelist name ('alex', 'sarah', 'jordan')
        text: str,
        persona: Optional[str] = None,
        handoff: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Appends an interview dialogue turn to the session transcript.
        """
        turn_data = {
            "timestamp": time.time(),
            "speaker": speaker,
            "persona": persona or speaker,
            "text": text.strip(),
            "handoff": handoff,
            "metadata": metadata or {},
        }

        client = await self.get_client()
        if client and self._redis_available:
            try:
                await client.rpush(f"session:{session_id}:turns", json.dumps(turn_data))
                return turn_data
            except Exception as e:
                logger.warning("Error adding turn to Redis: %s", e)

        # In-Memory Fallback
        session = self._memory_store.setdefault(session_id, {
            "meta": {"current_persona": "alex", "difficulty_level": 3, "active": True},
            "turns": [],
            "claims": [],
        })
        session.setdefault("turns", []).append(turn_data)
        return turn_data

    async def get_turns(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves the complete timestamped transcript array.
        """
        client = await self.get_client()
        if client and self._redis_available:
            try:
                raw_turns = await client.lrange(f"session:{session_id}:turns", 0, -1)
                return [json.loads(t) for t in raw_turns]
            except Exception as e:
                logger.warning("Error reading turns from Redis: %s", e)

        # In-Memory Fallback
        return self._memory_store.get(session_id, {}).get("turns", [])

    # -------------------------------------------------------------------------
    # Persona Coordination
    # -------------------------------------------------------------------------
    async def get_current_persona(self, session_id: str) -> str:
        """
        Returns the active panelist persona ("alex", "sarah", "jordan").
        """
        client = await self.get_client()
        if client and self._redis_available:
            try:
                val = await client.hget(f"session:{session_id}:meta", "current_persona")
                if val:
                    return str(val)
            except Exception as e:
                logger.warning("Error getting persona from Redis: %s", e)

        # In-Memory Fallback
        return (
            self._memory_store.get(session_id, {})
            .get("meta", {})
            .get("current_persona", "alex")
        )

    async def set_current_persona(self, session_id: str, persona: str) -> str:
        """
        Updates the active panelist persona.
        """
        clean_persona = persona.lower().strip()
        client = await self.get_client()
        if client and self._redis_available:
            try:
                await client.hset(
                    f"session:{session_id}:meta", "current_persona", clean_persona
                )
                return clean_persona
            except Exception as e:
                logger.warning("Error setting persona in Redis: %s", e)

        # In-Memory Fallback
        session = self._memory_store.setdefault(session_id, {"meta": {}, "turns": [], "claims": []})
        session["meta"]["current_persona"] = clean_persona
        return clean_persona

    # -------------------------------------------------------------------------
    # Difficulty Metrics (1 - 5)
    # -------------------------------------------------------------------------
    async def get_difficulty(self, session_id: str) -> int:
        """
        Gets current difficulty level (1 to 5).
        """
        client = await self.get_client()
        if client and self._redis_available:
            try:
                val = await client.hget(f"session:{session_id}:meta", "difficulty_level")
                if val:
                    return int(val)
            except Exception as e:
                logger.warning("Error getting difficulty from Redis: %s", e)

        # In-Memory Fallback
        return (
            self._memory_store.get(session_id, {})
            .get("meta", {})
            .get("difficulty_level", 3)
        )

    async def set_difficulty(self, session_id: str, level: int) -> int:
        """
        Sets difficulty level stepped between 1 and 5.
        """
        clamped = max(1, min(5, level))
        client = await self.get_client()
        if client and self._redis_available:
            try:
                await client.hset(
                    f"session:{session_id}:meta", "difficulty_level", str(clamped)
                )
                return clamped
            except Exception as e:
                logger.warning("Error setting difficulty in Redis: %s", e)

        # In-Memory Fallback
        session = self._memory_store.setdefault(session_id, {"meta": {}, "turns": [], "claims": []})
        session["meta"]["difficulty_level"] = clamped
        return clamped

    async def adjust_difficulty(self, session_id: str, delta: int) -> int:
        """
        Steps difficulty up or down by delta.
        """
        current = await self.get_difficulty(session_id)
        new_val = max(1, min(5, current + delta))
        return await self.set_difficulty(session_id, new_val)

    # -------------------------------------------------------------------------
    # Claims Store
    # -------------------------------------------------------------------------
    async def add_claim(self, session_id: str, claim: str) -> None:
        """
        Stores a verified claim extracted from the candidate.
        """
        clean_claim = claim.strip()
        if not clean_claim:
            return

        client = await self.get_client()
        if client and self._redis_available:
            try:
                await client.rpush(f"session:{session_id}:claims", clean_claim)
                return
            except Exception as e:
                logger.warning("Error pushing claim to Redis: %s", e)

        # In-Memory Fallback
        session = self._memory_store.setdefault(session_id, {"meta": {}, "turns": [], "claims": []})
        session.setdefault("claims", []).append(clean_claim)

    async def get_claims(self, session_id: str) -> List[str]:
        """
        Retrieves all verified claims made by the candidate.
        """
        client = await self.get_client()
        if client and self._redis_available:
            try:
                return await client.lrange(f"session:{session_id}:claims", 0, -1)
            except Exception as e:
                logger.warning("Error reading claims from Redis: %s", e)

        # In-Memory Fallback
        return self._memory_store.get(session_id, {}).get("claims", [])

    # -------------------------------------------------------------------------
    # Profile & Role Pack Getters
    # -------------------------------------------------------------------------
    async def get_candidate_profile(self, session_id: str) -> Dict[str, Any]:
        client = await self.get_client()
        if client and self._redis_available:
            try:
                raw = await client.get(f"session:{session_id}:profile")
                if raw:
                    return json.loads(raw)
            except Exception as e:
                logger.warning("Error fetching candidate profile: %s", e)
        return self._memory_store.get(session_id, {}).get("profile", {})

    async def get_role_pack(self, session_id: str) -> Dict[str, Any]:
        client = await self.get_client()
        if client and self._redis_available:
            try:
                raw = await client.get(f"session:{session_id}:role_pack")
                if raw:
                    return json.loads(raw)
            except Exception as e:
                logger.warning("Error fetching role pack: %s", e)
        return self._memory_store.get(session_id, {}).get("role_pack", {})

    async def get_full_session_context(self, session_id: str) -> Dict[str, Any]:
        """
        Gathers comprehensive session snapshot for model prompting.
        """
        current_persona = await self.get_current_persona(session_id)
        difficulty = await self.get_difficulty(session_id)
        turns = await self.get_turns(session_id)
        claims = await self.get_claims(session_id)
        profile = await self.get_candidate_profile(session_id)
        role_pack = await self.get_role_pack(session_id)

        return {
            "session_id": session_id,
            "current_persona": current_persona,
            "difficulty_level": difficulty,
            "turn_count": len(turns),
            "recent_turns": turns[-6:] if turns else [],
            "claims": claims,
            "candidate_profile": profile,
            "role_pack": role_pack,
        }

    async def close_session(self, session_id: str) -> None:
        """
        Marks session inactive.
        """
        client = await self.get_client()
        if client and self._redis_available:
            try:
                await client.hset(f"session:{session_id}:meta", "active", "0")
            except Exception as e:
                logger.warning("Error marking session inactive in Redis: %s", e)

        if session_id in self._memory_store:
            self._memory_store[session_id].setdefault("meta", {})["active"] = False


# Singleton instance
session_manager = SessionContextManager()
