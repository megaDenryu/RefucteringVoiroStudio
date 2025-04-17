import json
import uuid
from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.I方針策定部署 import I方針策定部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.総合方針 import 総合方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アクション計画 import ThinkGraph, 思考グラフ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況リスト, 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ

class 計画クエリの代理(QueryProxy):
    def __init__(self):
        pass

    @classmethod
    def 状況から作成(cls, v状況履歴: 状況履歴, 記憶部署: I記憶部署, vキャラクター情報: I自分の情報コンテナ, 追伸:IModelDumpAble|str|None = None):
        クエリ = cls()
        クエリ._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("記憶部署", 記憶部署),
            クエリ段落("キャラクター情報", vキャラクター情報),
            クエリ段落("指示文", クエリ.指示文),
        ]
        if 追伸 is not None:
            クエリ._クエリプロキシ.append(クエリ段落("追伸", 追伸))
        return クエリ

    @classmethod
    def 情報から作成(cls, 情報リスト:list[IModelDumpAble]):
        クエリ = cls()
        for index in range(len(情報リスト)):
            クエリ._クエリプロキシ.append(クエリ段落(f"情報{index}", 情報リスト[index]))
        クエリ._クエリプロキシ.append(クエリ段落("指示文", クエリ.指示文))
        return クエリ

    @property
    def 指示文(self) -> str:
        return "状況履歴と前の思考と現在方針をもとに、思考アクション計画を立ててください。"
    


class 思考アクション計画する人:
    _llm:切り替え可能LLMBox
    def __init__(self):
        self._llm = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考アクション計画する人)

    async def 計画を立てる(self, v状況履歴: 状況履歴, 記憶: I記憶部署, vキャラクター情報: I自分の情報コンテナ, 追伸:IModelDumpAble|str|None = None)->思考グラフ:
        """
        与えられた状況履歴をもとに、自分の欲望を満たすような答えを出すための思考をするための計画を立てる
        """
        計画クエリ = 計画クエリの代理.状況から作成(v状況履歴, 記憶, vキャラクター情報, 追伸)
        think_graph = await self._llm.llmUnit.asyncGenerateResponse(計画クエリ.json文字列でクエリ出力, ThinkGraph)
        if not isinstance(think_graph, ThinkGraph):
            raise TypeError("思考アクション計画の結果がThinkGraphではありません")
        return 思考グラフ(think_graph)
    

        
