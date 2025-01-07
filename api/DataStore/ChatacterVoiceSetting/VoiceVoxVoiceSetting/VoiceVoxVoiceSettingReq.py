

from api.gptAI.HumanInformation import CharacterId
from pydantic import BaseModel


class VoiceVoxVoiceSettingReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: CharacterId