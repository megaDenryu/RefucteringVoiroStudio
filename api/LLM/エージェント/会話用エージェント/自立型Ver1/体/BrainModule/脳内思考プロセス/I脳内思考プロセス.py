
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.思考プロセス状態 import 思考状態


class I脳内思考プロセス(ABC):
    @property
    @abstractmethod
    def 思考履歴を見て思い出す(self)->list[思考状態]:
        pass

    @property
    @abstractmethod
    def 最新の思考状態(self)->思考状態:
        pass

    @abstractmethod
    async def 脳内思考プロセスを開始(self):
        pass

    @abstractmethod
    async def 脳内思考プロセスを進める(self):
        pass

    @abstractmethod
    async def 脳内思考プロセスを終了(self):
        pass