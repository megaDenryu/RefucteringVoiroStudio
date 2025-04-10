from api import Extend
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モード.出力BaseModel import CreativeAssociationOutput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モード.思考用クエリ import 創造的連想クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴

class 創造的連想モジュール:
    _llmBox: 切り替え可能LLMBox

    def __init__(self) -> None:
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.創造的連想)

    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報) -> CreativeAssociationOutput:
        proxy = 創造的連想クエリプロキシ(v状況履歴, vキャラクター情報, v思考履歴)
        ExtendFunc.ExtendPrint(proxy.json文字列でクエリ出力)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,CreativeAssociationOutput)
        if isinstance(result, CreativeAssociationOutput):
            return result
        raise TypeError("思考ノードの結果がCreativeAssociationOutputではありません")