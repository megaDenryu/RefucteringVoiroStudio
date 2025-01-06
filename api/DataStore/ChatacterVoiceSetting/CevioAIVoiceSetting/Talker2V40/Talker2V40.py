

from pydantic import BaseModel, Field


class Talker2V40(BaseModel):
    Cast: str = Field(default="")
    Volume: int = Field(ge=0, le=100, default=50)
    Speed: int = Field(ge=0, le=100, default=50)
    Tone: int = Field(ge=0, le=100, default=50)
    Alpha: int = Field(ge=0, le=100, default=50)
    ToneScale: int = Field(ge=0, le=100, default=50)
