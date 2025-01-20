

from typing import Literal, TypedDict
from pydantic import BaseModel

from api.gptAI.HumanInformation import ICharacterModeState


class WavInfoB(BaseModel):
    path:str
    wav_data:str
    phoneme_time:list[str]
    phoneme_str:list[list[str]]
    char_name:str
    voice_system_name:str

class WavInfo(TypedDict):
    path:str
    wav_data:str
    wav_time:float
    phoneme_time:list[str]
    phoneme_str:list[list[str]]
    char_name:str
    characterModeState:ICharacterModeState
    voice_system_name:Literal["AIVoice","Cevio","VoiceVox","Coeiroink"]



class SendData(TypedDict):
    sentence:dict[str,str]
    wav_info:list[WavInfo]
    chara_type:Literal["gpt","player"]