

from pydantic import BaseModel, Field


class Talker2V40(BaseModel):
    Cast: str = Field(default="桜乃そら")
    Volume: int = Field(min_value=0, max_value=100, default=50)
    Speed: int = Field(min_value=0, max_value=100, default=50)
    Tone: int = Field(min_value=0, max_value=100, default=50)
    Alpha: int = Field(min_value=0, max_value=100, default=50)
    ToneScale: int = Field(min_value=0, max_value=100, default=50)
