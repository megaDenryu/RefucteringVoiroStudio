
from pydantic import BaseModel
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingSaveModel import CoeiroinkCharacterSettingSaveModel



class CoeiroinkCharacterSettingSaveModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    coeiroinkCharacterSettingModel: CoeiroinkCharacterSettingSaveModel

