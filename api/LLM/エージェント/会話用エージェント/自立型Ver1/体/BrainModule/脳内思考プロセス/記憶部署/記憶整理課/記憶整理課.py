from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.情報整理モデル群.記憶整理モデル.記憶整理モデル import 記憶整理モデル


class 記憶整理課(IModelDumpAble):
    """
    記憶を整理して、整理済みの記憶を管理する課
    """
    v記憶整理モデル: 記憶整理モデル
    _data : list[IModelDumpAble]
    def __init__(self) -> None:
        self._data = []
    def model_dump(self)->list[dict|list]:
        """
        思考状態をprimitiveに変換する
        """
        ret_data = [思考状態.model_dump() for 思考状態 in self._data]
        return ret_data
    async def 記憶整理(self, 記憶: list[IModelDumpAble]):
        """
        記憶を整理する
        """
        # LLMを使って記憶を整理する
        result = await self.v記憶整理モデル.情報をもとに実行(記憶)
        self._data.append(result)
    
    