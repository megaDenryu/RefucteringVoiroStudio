from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラに依存しない作業モデル import Iキャラに依存しない作業モデル


class 記憶整理モデル(Iキャラに依存しない作業モデル):
    _llmBox: 切り替え可能LLMBox
    def __init__(self):
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.記憶整理)

    async def 情報をもとに実行(self, 情報: list[IModelDumpAble]) -> IModelDumpAble:
        """
        情報をもとに実行する
        """
        result = await self._llmBox.llmUnit.asyncGenerateResponse(情報)
        if isinstance(result, IModelDumpAble):
            return result
        raise TypeError("思考ノードの結果がlistではありません")