
from pydantic import BaseModel, Field
from api.DataStore.AppSetting.AppSettingModel.SerifSetting.SerifSettingModel import SerifSettingModel
from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel

class CevioAICharacterSettingSaveModel(BaseModel):
    saveID: str = Field(title="保存ID", description="保存IDを指定します。")
    characterInfo:CharacterInfo
    voiceSetting: CevioAIVoiceSettingModel = Field(default_factory=CevioAIVoiceSettingModel, title="音声設定", description="音声設定を指定します。")
    readingAloud: SerifSettingModel = Field(default_factory=SerifSettingModel, title="読み上げ設定", description="読み上げ設定を指定します。")



