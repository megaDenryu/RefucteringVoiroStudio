from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter

class CoeiroinkVoiceSettingModel(BaseModel):
    speedScale: float = Field(ge=0.5, le=2.0, default=1.0)
    pitchScale: float = Field(ge=-0.15, le=0.15, default=0.0)
    intonationScale: float = Field(ge=0, le=2.0, default=1.0)
    volumeScale: float = Field(ge=0.0, le=2.0, default=1.0)
    読み上げ間隔: float = Field(ge=0.0, le=2.0, default=0.0)
    AIによる文章変換: AISentenceConverter = Field(default=AISentenceConverter.無効)
