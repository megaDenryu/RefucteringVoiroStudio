
from abc import ABC, abstractmethod

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定input import 方針策定input


class I方針策定部署(ABC):
    @abstractmethod
    async def 方針を策定する(self, input:方針策定input):
        pass

    @abstractmethod
    def model_dump(self):
        pass