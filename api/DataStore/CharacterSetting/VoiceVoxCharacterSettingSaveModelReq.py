
from pydantic import BaseModel
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingSaveModel import VoiceVoxCharacterSettingSaveModel



class VoiceVoxCharacterSettingSaveModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    voiceVoxCharacterSettingModel: VoiceVoxCharacterSettingSaveModel

