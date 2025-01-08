


    # クエリのうち設定で使うものだけを抜き出したクラス
from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CoeiroinkVoiceSetting.CoeiroinkVoiceSettingModel import CoeiroinkVoiceSettingModel

class CoeiroinkVoiceSettingModelReq(BaseModel):
    page_mode: str
    client_id: str
    character_id: str
    coeiroinkVoiceSettingModel: CoeiroinkVoiceSettingModel = Field(default_factory=CoeiroinkVoiceSettingModel)
