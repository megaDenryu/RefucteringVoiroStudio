
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class I会話履歴(ABC):
    @abstractmethod
    def addOnMessage(self, messageUnit):
        pass
    @abstractmethod
    def 会話(self)->Conversation:
        pass