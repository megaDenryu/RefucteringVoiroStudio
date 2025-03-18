
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody


class I表現機構(ABC):
    @abstractmethod
    def しゃべる(self, message:str):
        pass

    @abstractmethod
    def 表現する(self,表現したいこと:PresentationByBody):
        pass