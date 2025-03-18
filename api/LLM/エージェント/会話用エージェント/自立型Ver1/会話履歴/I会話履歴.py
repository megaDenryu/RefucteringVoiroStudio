from collections.abc import Callable, Awaitable

from abc import ABC, abstractmethod
from typing import TypeAlias

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation

# 引数なしで何も返さない非同期関数の型
OnMessageCallback: TypeAlias = Callable[[], Awaitable[None]]

class I会話履歴(ABC):
    @abstractmethod
    def addOnMessage(self, asyncMethod:OnMessageCallback)->None:
        pass
    @abstractmethod
    def 会話(self)->Conversation:
        pass