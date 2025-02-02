

from pydantic import BaseModel, Field
from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.AIVoiceVoiceSetting.AIVoiceVoiceSettingModel import AIVoiceVoiceSettingModel


class AIVoiceCharacterSettingSaveModel(BaseModel):
    saveID: str = Field(title="保存ID", description="保存IDを指定します。")
    characterInfo: CharacterInfo
    voiceSetting: AIVoiceVoiceSettingModel = Field(default_factory=AIVoiceVoiceSettingModel, title="音声設定", description="音声設定を指定します。")