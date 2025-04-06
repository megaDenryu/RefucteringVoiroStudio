
import asyncio
from uuid import uuid4
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FormatConverter import BaseModel2MD
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.プロセス材料.プロセス材料を包んだもの import プロセス材料を包んだもの
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.思考グラフ部署 import 思考グラフ部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.浅い思考.浅い思考部署 import 浅い思考部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況リスト
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況統合所 import 状況統合所
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ


class 脳内思考プロセス:
    _v自分の情報:I自分の情報コンテナ
    _思考履歴: 思考履歴
    _外部状況統合所: 状況統合所
    _思考グラフ部署: 思考グラフ部署
    _浅い思考部署: 浅い思考部署
    _プロセス材料溜め置き場: list[プロセス材料を包んだもの]
    @property
    def 思考履歴を見て思い出す(self)->思考履歴:
        return self._思考履歴
    @property
    def 最新の思考状態(self)->思考状態:
        return self._思考履歴.最新の思考状態
    
    def __init__(self, v自分の情報:I自分の情報コンテナ):
        self._v自分の情報 = v自分の情報
        self._思考履歴 = 思考履歴([思考状態.初期思考状態を生成()])
        self._プロセス材料溜め置き場 = []
        self._外部状況統合所 = 状況統合所()
        self._思考グラフ部署 = 思考グラフ部署(self._v自分の情報)

    async def 脳内思考プロセスを開始(self):
        """
        開始処理（データロード、前処理、初期思考生成）を行う
        """
        pass

    async def 脳内思考プロセスを進める(self, 最新メッセージ:list[MessageUnitVer1]):
        # new思考状態:思考状態 = 思考状態(
        #     id = str(uuid4()), 
        #     思考内容 = ConvertAndSaveLog.MarkdownConvertList(model = messageUnits, log=True)
        # )
        状況履歴:状況リスト = self._外部状況統合所.思考可能な形に状況を整理して変換(self._プロセス材料溜め置き場,最新メッセージ)
        self._ブロッキングなしで深い思考を実行する(状況履歴)
        await self._浅い思考(状況履歴)
        self._プロセス材料溜め置き場 = []
    

    async def 脳内思考プロセスを終了(self):
        pass

    def プロセス材料に変換して溜める(self, 脳内表現イベント: I脳内表現イベント):
        プロセス材料:プロセス材料を包んだもの = プロセス材料を包んだもの(脳内表現イベント)
        self._プロセス材料溜め置き場.append(プロセス材料)
        ExtendFunc.ExtendPrint(self._プロセス材料溜め置き場)
    
    def _ブロッキングなしで深い思考を実行する(self, 状況履歴: 状況リスト):
        asyncio.create_task(self._深い思考(状況履歴))

    async def _深い思考(self, 状況履歴: 状況リスト):
        new思考状態:思考状態 = await self._思考グラフ部署.思考を進める(状況履歴,self._思考履歴)
        self._思考履歴.追加(new思考状態)

    async def _浅い思考(self, 状況履歴: 状況リスト):
        new思考状態:思考状態 = await self._浅い思考部署.思考を進める(状況履歴,self._思考履歴)
        self._思考履歴.追加(new思考状態)