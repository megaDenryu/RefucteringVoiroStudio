from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBody import LLMHumanBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報 import 自分の情報コンテナ


class I体を持つ者(ABC):
    @property
    @abstractmethod
    def llmHumanBody(self)->LLMHumanBody:
        pass

    @property
    @abstractmethod
    def llmHumanBodyInput(self)->LLMHumanBodyInput:
        pass

    @property
    @abstractmethod
    def 自分の情報(self)->自分の情報コンテナ:
        pass

    @abstractmethod
    def 会話履歴注入(self, 会話履歴: I会話履歴):
        pass
    