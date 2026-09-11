from __future__ import annotations

import os
from functools import lru_cache
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str = Field(default="", validation_alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.0-flash", validation_alias="GEMINI_MODEL")
    groq_api_key: str = Field(default="", validation_alias="GROQ_API_KEY")
    groq_chat_model: str = Field(default="openai/gpt-oss-120b", validation_alias="GROQ_CHAT_MODEL")
    redis_url: str = Field(default="redis://localhost:6379/0", validation_alias="REDIS_URL")

    host: str = Field(default="0.0.0.0", validation_alias="HOST")
    port: int = Field(default=8000, validation_alias="PORT")
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")

    allowed_origins: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        validation_alias="ALLOWED_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000", "http://127.0.0.1:3000"]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
