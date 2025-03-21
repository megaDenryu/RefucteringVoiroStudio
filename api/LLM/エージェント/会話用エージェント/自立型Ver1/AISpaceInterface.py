
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者


class AISpaceInterface(ABC):
    @abstractmethod
    def 空間に人間を追加して会話履歴を注入(self, 人間:I体を持つ者):
        pass
    @abstractmethod
    async def 会話更新(self, messageUnit: MessageUnitVer1):
        pass