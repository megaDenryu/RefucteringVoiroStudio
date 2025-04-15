
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.I思考モデル import I思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import InternalMonologue
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.思考用クエリ import 深層的自問自答クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 自問自答モジュール(I思考モデル):
    _llmBox: 切り替え可能LLMBox

    def __init__(self) -> None:
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.ハイデガー的自問自答)

    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> InternalMonologue:
        proxy = 深層的自問自答クエリプロキシ(v状況履歴, vキャラクター情報, v思考履歴)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,InternalMonologue)
        if isinstance(result, InternalMonologue):
            return result
        raise TypeError("思考ノードの結果がInternalMonologueではありません")
