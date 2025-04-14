from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.I思考モデル import I思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.出力BaseModel import Benefit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.報酬ベクトル生成クエリプロキシ import 報酬ベクトル生成クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 感情ベクトル生成モデル(I思考モデル):
    _llmBox: 切り替え可能LLMBox
    def __init__(self):
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.感情ベクトル生成)

    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報:I自分の情報コンテナ) -> Benefit:
        return await self.生成する(v状況履歴, v思考履歴, vキャラクター情報)

    async def 生成する(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報:I自分の情報コンテナ) -> Benefit:
        proxy = 報酬ベクトル生成クエリプロキシ.履歴から生成(v状況履歴, v思考履歴, vキャラクター情報)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力, Benefit)
        if isinstance(result, Benefit):
            return result
        raise TypeError("思考ノードの結果がlistではありません")
    
    async def 状況から実際に受け取る報酬を生成する(self, 状況:list[IModelDumpAble|str]) -> Benefit:
        proxy = 報酬ベクトル生成クエリプロキシ.状況から報酬を生成(状況)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力, Benefit)
        if isinstance(result, Benefit):
            return result
        raise TypeError("思考ノードの結果がlistではありません")
    
    async def 予測された未来から受け取れる報酬を予測する(self, 未来予測:list[IModelDumpAble|str]) -> Benefit:
        proxy = 報酬ベクトル生成クエリプロキシ.状況から報酬を生成(未来予測)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力, Benefit)
        if isinstance(result, Benefit):
            return result
        raise TypeError("思考ノードの結果がlistではありません")
