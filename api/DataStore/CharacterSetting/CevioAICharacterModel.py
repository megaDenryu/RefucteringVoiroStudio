
from pydantic import BaseModel, Field

from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxVoiceSettingModel import VoiceVoxVoiceSettingModel



class VoiceVoxCharacterModel(BaseModel):
    saveID: str = Field(title="保存ID", description="保存IDを指定します。")
    characterInfo:CharacterInfo
    voiceSetting: CevioAIVoiceSettingModel = Field(CevioAIVoiceSettingModel(), title="音声設定", description="音声設定を指定します。")



