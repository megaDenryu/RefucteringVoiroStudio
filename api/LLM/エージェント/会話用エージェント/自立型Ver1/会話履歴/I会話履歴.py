
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class I会話履歴発行者(ABC):
    @abstractmethod
    def addOnMessage(self, messageUnit):
        pass
    @abstractmethod
    def 会話を見る(self)->Conversation:
        pass