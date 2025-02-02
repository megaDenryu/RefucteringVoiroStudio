

from pydantic import BaseModel, Field
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter


class AIVoiceVoiceSettingModel(BaseModel):
    読み上げ間隔: float = Field(ge=0.0, le=2.0, default=0.0)
    AIによる文章変換: AISentenceConverter = Field(default=AISentenceConverter.無効)