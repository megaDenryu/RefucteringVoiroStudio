

from pydantic import BaseModel, Field
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingSaveModel import AIVoiceCharacterSettingSaveModel
from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.AIVoiceVoiceSetting.AIVoiceVoiceSettingModel import AIVoiceVoiceSettingModel


class AIVoiceCharacterSettingSaveModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    aiVoiceCharacterSettingSaveModel:AIVoiceCharacterSettingSaveModel