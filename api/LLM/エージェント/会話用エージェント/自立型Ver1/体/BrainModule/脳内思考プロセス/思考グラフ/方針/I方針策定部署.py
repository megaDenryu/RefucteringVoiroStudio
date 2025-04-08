
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.中期方針 import 中期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.長期方針 import 長期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定input import 方針策定input


class I方針策定部署(ABC):
    @abstractmethod
    async def 短期方針を策定する(self, input:方針策定input)->短期方針:
        pass

    @abstractmethod
    async def 中期方針を策定する(self, input:方針策定input)->中期方針:
        pass

    @abstractmethod
    async def 長期方針を策定する(self, input:方針策定input)->長期方針:
        pass

    @abstractmethod
    def model_dump(self):
        pass