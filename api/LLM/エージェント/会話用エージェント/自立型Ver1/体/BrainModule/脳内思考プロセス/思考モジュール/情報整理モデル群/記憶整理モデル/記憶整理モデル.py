import asyncio
from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラに依存しない作業モデル import Iキャラに依存しない作業モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.情報整理モデル群.記憶整理モデル.出力BaseModel import MemoryAsLifeInsight, OrganizingMemoryAsConcept, OrganizingMemoryAsQA, OrganizingMemoryAsRule, OrganizingMemoryAsTheorem, OrganizingMemoryResult, OrganizingMemoryResultBenefitEmotion
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.情報整理モデル群.記憶整理モデル.記憶整理クエリプロキシ import 記憶整理クエリプロキシ


class 記憶整理モデル(Iキャラに依存しない作業モデル):
    _llmBox: 切り替え可能LLMBox
    def __init__(self):
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.記憶整理)

    async def 情報をもとに実行(self, 情報: list[IModelDumpAble]) -> IModelDumpAble:
        """
        情報をもとに実行する
        """
        クエリプロキシ = 記憶整理クエリプロキシ(情報)
        報酬感情, 定理, ルール, 概念, 問と答え, 人生の洞察 = await asyncio.gather(
            self.報酬と感情を抽出(クエリプロキシ),
            self.人生の定理を抽出(クエリプロキシ),
            self.人生のルールを抽出(クエリプロキシ),
            self.概念を抽出(クエリプロキシ),
            self.人生の問と答えを抽出(クエリプロキシ),
            self.人生の洞察を抽出(クエリプロキシ)
        )
        記憶整理結果 = OrganizingMemoryResult(
            報酬感情=報酬感情,
            人生での定理=定理,
            人生のルール=ルール,
            概念=概念,
            人生での問と答え=問と答え,
            人生からの洞察 = 人生の洞察
        )
        
        if isinstance(記憶整理結果, OrganizingMemoryResult):
            return 記憶整理結果
        raise TypeError("思考ノードの結果がlistではありません")
    
    async def 報酬と感情を抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> OrganizingMemoryResultBenefitEmotion:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,OrganizingMemoryResultBenefitEmotion)
        if isinstance(result, OrganizingMemoryResultBenefitEmotion):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryResultBenefitEmotionではありません")
    
    async def 人生の定理を抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> OrganizingMemoryAsTheorem:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,OrganizingMemoryAsTheorem)
        if isinstance(result, OrganizingMemoryAsTheorem):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryAsTheoremではありません")
    
    async def 人生のルールを抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> OrganizingMemoryAsRule:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,OrganizingMemoryAsRule)
        if isinstance(result, OrganizingMemoryAsRule):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryAsRuleではありません")
    
    async def 概念を抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> OrganizingMemoryAsConcept:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,OrganizingMemoryAsConcept)
        if isinstance(result, OrganizingMemoryAsConcept):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryAsConceptではありません")
    
    async def 人生の問と答えを抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> OrganizingMemoryAsQA:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,OrganizingMemoryAsQA)
        if isinstance(result, OrganizingMemoryAsQA):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryAsQAではありません")
    
    async def 人生の洞察を抽出(self, クエリプロキシ: 記憶整理クエリプロキシ) -> MemoryAsLifeInsight:
        result = await self._llmBox.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力,MemoryAsLifeInsight)
        if isinstance(result, MemoryAsLifeInsight):
            return result
        raise TypeError("思考ノードの結果がOrganizingMemoryResultではありません")