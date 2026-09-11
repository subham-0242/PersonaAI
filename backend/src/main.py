from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.routes_ingest import router as ingest_router
from .api.routes_orchestrator import router as orchestrator_router
from .api.routes_session import router as session_router
from .api.websocket_audio import router as websocket_router
from .config import get_settings
from .orchestration.graph import LANGGRAPH_ACTIVE
from .services.session_context import session_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("personapanel.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Initializing PersonaPanel AI Backend (SIH26044)...")
    logger.info("Environment: %s | Port: %d", settings.environment, settings.port)
    logger.info("Allowed CORS Origins: %s", settings.allowed_origins)

    # Initialize connection test to Redis if available
    await session_manager.get_client()

    yield

    logger.info("Shutting down PersonaPanel AI Backend...")
    client = await session_manager.get_client()
    if client:
        await client.aclose()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="PersonaPanel AI - Phase 3 Multi-Agent Orchestration & Dynamic Handoff Core",
        description=(
            "LangGraph-driven Multi-Agent Orchestrator, Autonomous Personas "
            "(Tech Lead Alex, Product Manager Sarah, Hiring Manager Jordan), "
            "Groq openai/gpt-oss-120b Dialogue Engine, Gemini 2.0 Flash Auditor, "
            "and Edge-TTS Neural Voice Synthesizer."
        ),
        version="3.0.0",
        lifespan=lifespan,
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins if settings.allowed_origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Attach Routers
    app.include_router(ingest_router)
    app.include_router(session_router)
    app.include_router(websocket_router)
    app.include_router(orchestrator_router)

    @app.get("/health", tags=["Health"])
    @app.get("/", tags=["Health"])
    async def health_check():
        has_gemini = bool(settings.gemini_api_key)
        has_groq = bool(settings.groq_api_key)

        return JSONResponse(
            content={
                "status": "healthy",
                "service": "PersonaPanel AI Multi-Agent Core",
                "version": "3.0.0",
                "phase": "Phase 3: Multi-Agent Orchestration & Dynamic Handoff Core",
                "timestamp": time.time(),
                "orchestration": {
                    "framework": "LangGraph" if LANGGRAPH_ACTIVE else "Native StateGraph",
                    "nodes": ["auditor", "tech_lead", "product_manager", "hiring_manager", "coordinator"],
                    "personas": ["alex", "sarah", "jordan"],
                    "handoff_mode": "contextual_dynamic",
                },
                "integrations": {
                    "gemini_api": "active" if has_gemini else "fallback_simulation",
                    "groq_api": "active" if has_groq else "fallback_simulation",
                    "redis": "connected" if session_manager._redis_available else "in_memory_fallback",
                    "edge_tts": "active",
                },
                "models": {
                    "stt": "groq/whisper-large-v3",
                    "dialogue": settings.groq_chat_model or "openai/gpt-oss-120b",
                    "audit_and_contradictions": settings.gemini_model or "gemini-2.0-flash",
                    "voices": {
                        "alex": "en-US-GuyNeural (Tech Lead)",
                        "sarah": "en-US-JennyNeural (Product Manager)",
                        "jordan": "en-US-BrianNeural (Hiring Lead)",
                    },
                },
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run("backend.src.main:app", host=settings.host, port=settings.port, reload=True)
