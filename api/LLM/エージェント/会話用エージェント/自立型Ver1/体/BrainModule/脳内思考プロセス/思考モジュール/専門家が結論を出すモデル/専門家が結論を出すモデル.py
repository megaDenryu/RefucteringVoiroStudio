
from pydantic import BaseModel
from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.I思考モデル import I思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.思考用クエリ import 創造的連想クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.出力BaseModel import ConversationProgressStatus, ExpertConversation, ExpertConversationContinue
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.思考用クエリ import 専門家同士の会話クエリプロキシ, 専門家同士の会話クエリプロキシ2, 専門家同士の会話続きクエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 専門家が結論を出すモデル(I思考モデル):
    _llmBox: 切り替え可能LLMBox

    def __init__(self) -> None:
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.専門家が問に対して結論を出す)

    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> BaseModel:
        結果 = await self.専門家同士の会話シミュレート2(v状況履歴, v思考履歴, vキャラクター情報)
        while 結果.g結論が出たかまだ続けるかの判断 == ConversationProgressStatus.まだ続ける:
            結果 = await self.専門家同士の会話シミュレート続き(結果)
        return 結果

    async def 問いに答える(self, 問い: IModelDumpAble, 私の名前:str) -> BaseModel:
        結果 = await self.専門家同士の会話シミュレート(問い,私の名前)
        while 結果.g結論が出たかまだ続けるかの判断 == ConversationProgressStatus.まだ続ける:
            結果 = await self.専門家同士の会話シミュレート続き(結果)
        return 結果

    async def 専門家同士の会話シミュレート(self, 問い: IModelDumpAble, 私の名前:str) -> ExpertConversation:
        proxy = 専門家同士の会話クエリプロキシ(私の名前,問い)
        ExtendFunc.ExtendPrint(proxy.dict化クエリ)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,ExpertConversation)
        if isinstance(result, ExpertConversation):
            return result
        raise TypeError("思考ノードの結果がCreativeAssociationOutputではありません")
    
    async def 専門家同士の会話シミュレート2(self, v状況履歴: 状況履歴, v思考履歴: I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> ExpertConversation:
        proxy = 専門家同士の会話クエリプロキシ2(v状況履歴, v思考履歴, vキャラクター情報)
        ExtendFunc.ExtendPrint(proxy.dict化クエリ)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,ExpertConversation)
        
        if isinstance(result, ExpertConversation):
            return result
        raise TypeError("思考ノードの結果がCreativeAssociationOutputではありません")
    
    async def 専門家同士の会話シミュレート続き(self, 専門家同士の会話: ExpertConversation) -> ExpertConversation:
        proxy = 専門家同士の会話続きクエリプロキシ(専門家同士の会話)
        ExtendFunc.ExtendPrint(proxy.dict化クエリ)
        result = await self._llmBox.llmUnit.asyncGenerateResponse(proxy.json文字列でクエリ出力,ExpertConversationContinue)
        
        if isinstance(result, ExpertConversationContinue):
            専門家同士の会話.e本番会話内容 += result.e本番会話内容
            専門家同士の会話.g結論が出たかまだ続けるかの判断 = result.g結論が出たかまだ続けるかの判断
            return 専門家同士の会話
        raise TypeError("思考ノードの結果がCreativeAssociationOutputではありません")