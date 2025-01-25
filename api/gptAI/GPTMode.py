from enum import Enum
from typing import Literal, TypeAlias

from pydantic import BaseModel
from api.gptAI.HumanInfoValueObject import CharacterName
from api.gptAI.HumanInformation import CharacterId

# GptMode: TypeAlias = Literal["off","individual_process0501dev"]

class GptMode(str,Enum):
    off = "off"
    individual_process0501dev = "individual_process0501dev"

class GPTModeReq(BaseModel):
    characterId: CharacterId
    gptMode: GptMode
    clientId: str
    

class GptModeManager:
    _gpt_mode_dict:dict[CharacterId,GptMode]
    def __init__(self):
        self._gpt_mode_dict = {}
    def setCharacterGptMode(self,characterId:CharacterId,mode:GptMode):
        self._gpt_mode_dict[characterId] = mode
    def getCharacterGptMode(self,characterId:CharacterId)->GptMode:
        try:
            return self._gpt_mode_dict[characterId]
        except KeyError:
            return GptMode.off
    def 特定のモードが動いてるか確認(self,mode:GptMode)->bool:
        return mode in self._gpt_mode_dict.values()