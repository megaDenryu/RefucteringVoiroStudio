from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モジュール種類 import ThinkingModuleEnum
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.選択部署.出力BaseModel import ThinkingMethodSelecter
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.選択部署.思考方法選択クエリプロキシ import 思考方法選択クエリプロキシ


class 選択部署:
    _llmBox: 切り替え可能LLMBox
    def __init__(self):
        _llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考の種類選択)

    async def 思考の種類を適当に選ぶ(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴) -> ThinkingModuleEnum:
        クエリプロキシ = 思考方法選択クエリプロキシ(v状況履歴, v思考履歴)
        結果 = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力, ThinkingMethodSelecter)
        if isinstance(結果, ThinkingMethodSelecter):
            return 結果.b思考方法
        raise TypeError("思考ノードの結果が思考モジュール種類ではありません")
    