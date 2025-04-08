
from uuid import uuid4
import uuid
from pydantic import BaseModel
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.I方針策定部署 import I方針策定部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.中期方針 import CompassMidTerm, 中期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import CompassShortTerm, 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針履歴 import 方針履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.総合方針 import 総合方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.長期方針 import CompassLongTerm, 長期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定input import 方針策定input
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況履歴

class 方針策定クエリプロキシ(QueryProxy):
    def __init__(self, v状況履歴: 状況履歴):
        self._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("考えてほしいこと", "状況履歴をもとに、方針を策定してください。"),
        ]

    def カスタム出力(self)->str:
        raise NotImplementedError("カスタム出力は実装されていません。")

class 方針策定部署(I方針策定部署):
    _llmUnit:切り替え可能LLMBox
    _方針履歴:方針履歴
    def __init__(self) -> None:
        self._llmUnit = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.方針策定)
        self._方針履歴 = 方針履歴([短期方針.初期方針()], [中期方針.初期方針()] , [長期方針.初期方針()])
    async def 短期方針を策定する(self, input:方針策定input)->短期方針:
        クエリプロキシ = 方針策定クエリプロキシ(input.v状況履歴)
        retData = await self._llmUnit.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力, CompassShortTerm)
        if not isinstance(retData, CompassShortTerm):
            raise TypeError("方針策定の結果がCompassではありません")
        self._方針履歴.追加短期方針(短期方針(retData))
        return self._方針履歴.最新短期方針
    
    async def 中期方針を策定する(self, input:方針策定input)->中期方針:
        クエリプロキシ = 方針策定クエリプロキシ(input.v状況履歴)
        retData = await self._llmUnit.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力, CompassMidTerm)
        if not isinstance(retData, CompassMidTerm):
            raise TypeError("方針策定の結果がCompassではありません")
        self._方針履歴.追加中期方針(中期方針(retData))
        return self._方針履歴.最新中期方針
    
    async def 長期方針を策定する(self, input:方針策定input)->長期方針:
        クエリプロキシ = 方針策定クエリプロキシ(input.v状況履歴)
        retData = await self._llmUnit.llmUnit.asyncGenerateResponse(クエリプロキシ.json文字列でクエリ出力, CompassLongTerm)
        if not isinstance(retData, CompassLongTerm):
            raise TypeError("方針策定の結果がCompassではありません")
        self._方針履歴.追加長期方針(長期方針(retData))
        return self._方針履歴.最新長期方針
    
    
    @property
    def 現在方針(self)->総合方針:
        """
        最新の方針を取得する
        """
        return self._方針履歴.最新総合方針
        

