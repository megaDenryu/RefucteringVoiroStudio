import json
import uuid
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針object import 方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アクション計画 import ThinkGraph, 思考グラフ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況リスト

class 計画クエリの代理:
    _クエリプロキシ: list = []
    _状況履歴: 状況リスト
    _現在方針: 方針
    def __init__(self, 状況履歴: 状況リスト,現在方針: 方針):
        self._クエリプロキシ = [
            {"状況履歴": 状況履歴.primitive()},
            {"現在方針": 現在方針.compass.model_dump()},
            {"考えてほしいこと": "状況履歴と現在方針をもとに、思考アクション計画を立ててください。"},
        ]
        self._状況履歴 = 状況履歴
        self._現在方針 = 現在方針
    def json文字列で出力(self)->str:
        return json.dumps(self._クエリプロキシ, ensure_ascii=False, indent=2)
    
    def カスタム出力(self)->str:
        return f"""
        # 状況履歴:
        {self._状況履歴.リスト化文章()}
        # 現在方針:
        {self._現在方針.内容()}
        """


class 思考アクション計画する人:
    _llm:切り替え可能LLMBox
    def __init__(self):
        self._llm = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考アクション計画する人)

    async def 計画を立てる(self, 状況履歴: 状況リスト,現在方針: 方針)->思考グラフ:
        """
        与えられた状況履歴をもとに、自分の欲望を満たすような答えを出すための思考をするための計画を立てる
        """
        クエリプロキシ = 計画クエリの代理(状況履歴,現在方針)
        計画を立てるためのクエリ:list[IMessageQuery] = [
            IMessageQuery(
                id = str(uuid.uuid4()),
                role = "user",
                content = クエリプロキシ.json文字列で出力()
            )
        ]
        think_graph = await self._llm.llmUnit.asyncGenerateResponse(計画を立てるためのクエリ, ThinkGraph)
        if not isinstance(think_graph, ThinkGraph):
            raise TypeError("思考アクション計画の結果がThinkGraphではありません")
        return 思考グラフ(think_graph)
    

        
