from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ


class 記憶整理課(IModelDumpAble):
    """
    記憶を整理して、整理済みの記憶を管理する課
    """
    _llmBox: 切り替え可能LLMBox
    _data : list[IModelDumpAble]
    def __init__(self) -> None:
        self._data = []
    def model_dump(self)->list[dict|list]:
        """
        思考状態をprimitiveに変換する
        """
        ret_data = [思考状態.model_dump() for 思考状態 in self._data]
        return ret_data
    async def 記憶整理(self, 記憶: IModelDumpAble):
        """
        記憶を整理する
        """
        self._data.append(記憶)
        # LLMを使って記憶を整理する
        result = await self._llmBox.llmUnit.asyncGenerateResponse(記憶.model_dump())
        if isinstance(result, list):
            self._data = result
        else:
            raise TypeError("思考ノードの結果がlistではありません")
