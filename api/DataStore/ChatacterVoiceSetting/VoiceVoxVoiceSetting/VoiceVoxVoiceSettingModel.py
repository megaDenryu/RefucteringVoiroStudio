# クエリのうち設定で使うものだけを抜き出したクラス
from pydantic import BaseModel, Field

class VoiceVoxVoiceSettingModel(BaseModel):
    speedScale: float = Field(ge=0.5, le=2.0, default=1.0)
    pitchScale: float = Field(ge=-0.15, le=0.15, default=0.0)
    intonationScale: float = Field(ge=0, le=2.0, default=1.0)
    volumeScale: float = Field(ge=0, le=2.0, default=1.0)

    