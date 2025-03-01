from pydantic import BaseModel, Field

class CoeiroinkVoiceSettingModel(BaseModel):
    スピード: float = Field(ge=0.5, le=2.0, default=1.0)
    ピッチ: float = Field(ge=-0.15, le=0.15, default=0.0)
    イントネーション: float = Field(ge=0, le=2.0, default=1.0)
    音量: float = Field(ge=0.0, le=2.0, default=1.0)
