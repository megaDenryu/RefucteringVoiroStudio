from api.gptAI.HumanInformation import CharacterId
from pydantic import BaseModel


class CevioAIVoiceSettingReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: CharacterId