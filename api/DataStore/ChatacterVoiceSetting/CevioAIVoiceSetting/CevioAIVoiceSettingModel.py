from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.Talker2V40.Talker2V40 import Talker2V40
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.TalkerComponentArray2.TalkerComponentArray2 import TalkerComponentArray2


class CevioAIVoiceSettingModel(BaseModel):
    コンディション: Talker2V40 = Field(default_factory=Talker2V40)
    感情:TalkerComponentArray2 = Field(default_factory=TalkerComponentArray2)
