from pydantic import BaseModel

from pydantic import BaseModel, Field
from typing import Literal

class AnalysisResponse(BaseModel):
    is_complete: bool = Field(description="発話が文として完結しているか")
    should_respond: bool = Field(description="AIが現時点で返答すべきか")
    confidence: float = Field(ge=0.0, le=1.0, description="分析の信頼度")
    utterance_type: Literal["question", "statement", "command", "exclamation", "other"] = Field(description="発話の種類")
    intent: Literal["seek_empathy", "ask_question", "share_info", "request_action", "express_feeling", "other"] = Field(description="発話の意図")
    context_mood: Literal["casual", "serious", "tense", "friendly", "formal", "other"] = Field(description="会話の雰囲気")
    priority: Literal["high", "medium", "low"] = Field(description="応答の優先度")
    suggested_response_type: Literal["empathy", "question", "info", "action", "acknowledgement", "other"] = Field(description="推奨される応答の種類")