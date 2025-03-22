from abc import ABC, abstractmethod
from api.TtsSoftApi.VoiceSystemType import VoiceSystem
from api.gptAI.HumanInfoValueObject import CharacterId
from api.gptAI.VoiceInfo import WavInfo


class IHuman(ABC):
    @property
    @abstractmethod
    def id(self)->CharacterId:
        pass

    @abstractmethod
    def start(self, voiceroid_dict:dict[str,int] = {"cevio":0,"voicevox":0,"AIVOICE":0,"Coeiroink":0})->VoiceSystem:
        pass

    @abstractmethod
    def outputWaveFile(self,str:str)->list[WavInfo]|None:
        pass