from api import Extend
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.出力BaseModel import CreativeAssociationOutput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.思考用クエリ import 創造的連想クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ

class 創造的連想モジュール(Iキャラ依存思考モデル):
    _llmBox: 切り替え可能LLMBox

    def __init__(self) -> None:
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.創造的連想)

    async def 実行(self, v状況履歴: 状況履歴, v記憶部署: I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> CreativeAssociationOutput:
        proxy = 創造的連想クエリプロキシ(v状況履歴, vキャラクター情報, v記憶部署)
        ExtendFunc.ExtendPrint(proxy.json文字列でクエリ出力)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,CreativeAssociationOutput)
        if isinstance(result, CreativeAssociationOutput):
            return result
        raise TypeError("思考ノードの結果がCreativeAssociationOutputではありません")