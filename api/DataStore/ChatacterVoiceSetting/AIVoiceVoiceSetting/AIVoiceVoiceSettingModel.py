

from pydantic import BaseModel, Field


class AIVoiceVoiceSettingModel(BaseModel):
    声の調整方法: str = Field(default="音声調整はAIVoiceのソフトの方でできます")