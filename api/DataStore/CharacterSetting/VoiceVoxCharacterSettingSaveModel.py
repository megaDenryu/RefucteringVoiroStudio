
from pydantic import BaseModel, Field

from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxVoiceSettingModel import VoiceVoxVoiceSettingModel



class VoiceVoxCharacterSettingSaveModel(BaseModel):
    saveID: str = Field(title="保存ID", description="保存IDを指定します。")
    characterInfo:CharacterInfo
    voiceSetting: VoiceVoxVoiceSettingModel = Field(default_factory=VoiceVoxVoiceSettingModel, title="音声設定", description="音声設定を指定します。")



