from pydantic import BaseModel, Field
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxVoiceSettingModel import VoiceVoxVoiceSettingModel

class VoiceVoxVoiceSettingModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    voiceVoxVoiceSettingModel: VoiceVoxVoiceSettingModel = Field(default_factory=VoiceVoxVoiceSettingModel)

