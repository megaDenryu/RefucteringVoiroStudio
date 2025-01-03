
from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.TalkerComponentArray2.TalkerComponent2.TalkerComponent2 import TalkerComponent2



class TalkerComponentArray2(BaseModel):
    array: list[TalkerComponent2] = Field(default_factory=[])