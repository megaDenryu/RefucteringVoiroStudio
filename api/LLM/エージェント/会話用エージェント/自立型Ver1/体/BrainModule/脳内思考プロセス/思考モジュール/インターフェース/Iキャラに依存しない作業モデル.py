from abc import ABC, abstractmethod

from api.Extend.BaseModel.model_dumpable import IModelDumpAble


class Iキャラに依存しない作業モデル(ABC):
    """
    ただ単に情報のリストを受け取ってそれをもとに属人生のない思考を行うモデル
    """
    @abstractmethod
    async def 情報をもとに実行(self, 情報: list[IModelDumpAble]) -> IModelDumpAble:
        """
        思考を進める
        """
        pass