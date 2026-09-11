from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.routes_ingest import router as ingest_router
from .api.routes_session import router as session_router
from .api.websocket_audio import router as websocket_router
from .config import get_settings
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
        title="PersonaPanel AI - Phase 2 Audio & Model Orchestration Core",
        description=(
            "Real-Time Multi-Agent Voice Transport, Whisper Large v3 STT, "
            "LLaMA 3.3 70B Conversational Orchestrator, Gemini Contradiction Engine, "
            "and Edge-TTS Neural Voice Synthesizer."
        ),
        version="2.0.0",
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

    @app.get("/health", tags=["Health"])
    @app.get("/", tags=["Health"])
    async def health_check():
        has_gemini = bool(settings.gemini_api_key)
        has_groq = bool(settings.groq_api_key)

        return JSONResponse(
            content={
                "status": "healthy",
                "service": "PersonaPanel AI Backend Core",
                "version": "2.0.0",
                "timestamp": time.time(),
                "integrations": {
                    "gemini_api": "active" if has_gemini else "fallback_simulation",
                    "groq_api": "active" if has_groq else "fallback_simulation",
                    "redis": "connected" if session_manager._redis_available else "in_memory_fallback",
                    "edge_tts": "active",
                },
                "models": {
                    "stt": "groq/whisper-large-v3",
                    "dialogue": "openai/gpt-oss-120b",
                    "audit_and_contradictions": "google/gemini-3.6-flash",
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
