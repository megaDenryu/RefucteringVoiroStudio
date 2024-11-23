from typing import Literal, TypeAlias
from api.gptAI.HumanInfoValueObject import CharacterName

GptMode: TypeAlias = Literal["off","individual_process0501dev"]

class GptModeManager:
    _gpt_mode_dict:dict[CharacterName,GptMode]
    def __init__(self):
        self._gpt_mode_dict = {}
    def setCharacterGptMode(self,character:CharacterName,mode:GptMode):
        self._gpt_mode_dict[character] = mode
    def getCharacterGptMode(self,character:CharacterName)->GptMode:
        try:
            return self._gpt_mode_dict[character]
        except KeyError:
            return "off"
