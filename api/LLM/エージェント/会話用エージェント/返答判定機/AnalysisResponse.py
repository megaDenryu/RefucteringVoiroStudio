from pydantic import BaseModel

from pydantic import BaseModel, Field
from typing import Literal

class AnalysisResponse(BaseModel):
    is_complete: bool = Field(default=False, description="発話が文として完結しているか")
    should_respond: bool = Field(default=False, description="AIが現時点で返答すべきか")
    confidence: float = Field(default=0.5, ge=0.0, le=1.0, description="分析の信頼度")
    utterance_type: Literal["question", "statement", "command", "exclamation", "other"] = Field(default="other", description="発話の種類")
    intent: Literal["seek_empathy", "ask_question", "share_info", "request_action", "express_feeling", "other"] = Field(default="other", description="発話の意図")
    context_mood: Literal["casual", "serious", "tense", "friendly", "formal", "other"] = Field(default="casual", description="会話の雰囲気")
    priority: Literal["high", "medium", "low"] = Field(default="medium", description="応答の優先度")
    suggested_response_type: Literal["empathy", "question", "info", "action", "acknowledgement", "other"] = Field(default="acknowledgement", description="推奨される応答の種類")