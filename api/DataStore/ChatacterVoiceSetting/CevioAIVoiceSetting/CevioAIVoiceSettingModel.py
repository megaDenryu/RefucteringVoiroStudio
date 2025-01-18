from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.Talker2V40.Talker2V40 import Talker2V40
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.TalkerComponentArray2.TalkerComponentArray2 import TalkerComponentArray2
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter


class CevioAIVoiceSettingModel(BaseModel):
    talker2V40: Talker2V40 = Field(default_factory=Talker2V40)
    talkerComponentArray2:TalkerComponentArray2 = Field(default_factory=TalkerComponentArray2)
    読み上げ間隔: float = Field(ge=0.0, le=2.0, default=0.0)
    AIによる文章変換: AISentenceConverter = Field(AISentenceConverter.無効)
