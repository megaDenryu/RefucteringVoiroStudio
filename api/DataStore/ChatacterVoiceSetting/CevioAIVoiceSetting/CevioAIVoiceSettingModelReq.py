from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel


class CevioAIVoiceSettingModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    cevio_ai_voice_setting: CevioAIVoiceSettingModel = Field(default_factory=CevioAIVoiceSettingModel)