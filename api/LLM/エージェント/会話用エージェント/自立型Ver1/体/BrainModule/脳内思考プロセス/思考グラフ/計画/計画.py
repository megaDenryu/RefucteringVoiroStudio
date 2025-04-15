import json
import uuid
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

class 計画クエリの代理(QueryProxy):
    _状況履歴: 状況履歴
    _現在方針: 総合方針
    def __init__(self, v状況履歴: 状況履歴, 現在方針: 総合方針, 前の思考: I記憶部署):
        super().__init__()
        self._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("現在方針", 現在方針),
            クエリ段落("前の思考", 前の思考),
            クエリ段落("考えてほしいこと", "状況履歴と前の思考と現在方針をもとに、思考アクション計画を立ててください。"),
        ]
        self._状況履歴 = v状況履歴
        self._現在方針 = 現在方針
    


class 思考アクション計画する人:
    _llm:切り替え可能LLMBox
    def __init__(self):
        self._llm = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考アクション計画する人)

    async def 計画を立てる(self, v状況履歴: 状況履歴,方針策定部署:I方針策定部署, 前の思考:I記憶部署)->思考グラフ:
        """
        与えられた状況履歴をもとに、自分の欲望を満たすような答えを出すための思考をするための計画を立てる
        """
        計画クエリ = 計画クエリの代理(v状況履歴,方針策定部署.現在方針,前の思考)
        
        think_graph = await self._llm.llmUnit.asyncGenerateResponse(計画クエリ.json文字列でクエリ出力, ThinkGraph)
        if not isinstance(think_graph, ThinkGraph):
            raise TypeError("思考アクション計画の結果がThinkGraphではありません")
        return 思考グラフ(think_graph)
    

        
