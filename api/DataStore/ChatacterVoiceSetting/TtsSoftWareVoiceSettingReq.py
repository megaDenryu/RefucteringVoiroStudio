

from api.gptAI.HumanInformation import CharacterId,CharacterSaveId
from pydantic import BaseModel


class TtsSoftWareVoiceSettingReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: CharacterId
    saveID: CharacterSaveId