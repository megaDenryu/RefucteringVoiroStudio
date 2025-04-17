import asyncio
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.プロセス材料.プロセス材料を包んだもの import プロセス材料を包んだもの
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.思考グラフ部署 import 思考グラフ部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.感情.感情担当 import 感情状態管理
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定input import 方針策定input
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定llm import 方針策定部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.統合思考モデル.連鎖的思考モデル import モデル連鎖思考
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.I思考状態 import I思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.記憶部署 import 記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.浅い思考.浅い思考部署 import 浅い思考部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況統合所 import 状況統合所
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 脳内思考プロセス:
    _v自分の情報:I自分の情報コンテナ
    _思考履歴: I記憶部署
    _感情: 感情状態管理
    _方針策定課長: 方針策定部署

    _外部状況統合所: 状況統合所
    _思考グラフ部署: 思考グラフ部署
    _浅い思考部署: 浅い思考部署
    _プロセス材料溜め置き場: list[プロセス材料を包んだもの]
    @property
    def 思考履歴を見て思い出す(self)->I記憶部署:
        return self._思考履歴
    @property
    def 最新の思考状態(self)->I思考状態:
        return self._思考履歴.最新の思考状態
    
    def __init__(self, v自分の情報:I自分の情報コンテナ):
        self._v自分の情報 = v自分の情報
        self._思考履歴 = 記憶部署()
        self._プロセス材料溜め置き場 = []
        self._外部状況統合所 = 状況統合所()
        self._方針策定部署 = 方針策定部署()
        self._思考グラフ部署 = 思考グラフ部署(self._v自分の情報)
        self._感情 = 感情状態管理()

    def Tickスタート(self):
        # ノンブロッキングでTickする
        a = asyncio.create_task(self.Tick())
        # a.add_done_callback(self.脳内思考プロセスを開始)

    async def Tick(self):
        while True:
            await asyncio.sleep(180)
            await self.脳内思考プロセスを１回実行()

    async def 脳内思考プロセスを１回実行(self):
        連鎖と自問自答とそれの答えを探す思考方法をランダムに行うモデル = モデル連鎖思考()

    async def 脳内思考プロセスを進める(self, 最新メッセージ:list[MessageUnitVer1]):
        v状況履歴:状況履歴 = self._外部状況統合所.思考可能な形に状況を整理して変換(self._プロセス材料溜め置き場,最新メッセージ)
        self._ブロッキングなしで深い思考を実行する(v状況履歴)
        await self._浅い思考(v状況履歴)
        self._プロセス材料溜め置き場 = []

    async def 脳内思考プロセスを終了(self):
        pass

    def プロセス材料に変換して溜める(self, 脳内表現イベント: I脳内表現イベント):
        プロセス材料:プロセス材料を包んだもの = プロセス材料を包んだもの(脳内表現イベント)
        self._プロセス材料溜め置き場.append(プロセス材料)
        ExtendFunc.ExtendPrint(self._プロセス材料溜め置き場)
    
    def _ブロッキングなしで深い思考を実行する(self, v状況履歴: 状況履歴):
        asyncio.create_task(self._深い思考(v状況履歴))

    async def _深い思考(self, v状況履歴: 状況履歴):
        new思考状態:思考状態 = await self._思考グラフ部署.思考を進める(v状況履歴,self._思考履歴, self._方針策定部署)
        self._思考履歴.追加(new思考状態)

    async def _浅い思考(self, v状況履歴: 状況履歴):
        new思考状態:思考状態 = await self._浅い思考部署.思考を進める(v状況履歴,self._思考履歴)
        self._思考履歴.追加(new思考状態)    
    
    async def 方針を改定する(self, v状況履歴: 状況履歴) -> 短期方針:
        """
        与えられた状況履歴をもとに、次の方針を立てる
        """
        # 方針を立てる
        v方針 = await self._方針策定部署.短期方針を策定する(方針策定input(v状況履歴))
        return v方針
    
    
