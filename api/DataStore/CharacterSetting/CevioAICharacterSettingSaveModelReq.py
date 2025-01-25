
from pydantic import BaseModel

from api.DataStore.CharacterSetting.CevioAICharacterSettingSaveModel import CevioAICharacterSettingSaveModel


class CevioAICharacterSettingSaveModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    cevioAICharacterSettingModel: CevioAICharacterSettingSaveModel