import json
import re
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.LLMAPIBase.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.LLMリクエスト用BaseModel import ThinkNode
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況リスト, 状況履歴

class 思考内容プロキシ(QueryProxy):
    def __init__(self, v状況履歴:状況履歴 ,前の思考:思考履歴) -> None:
        self.状況履歴 = v状況履歴
        self.前の思考 = 前の思考
        self._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("前の思考", 前の思考),
            クエリ段落("考えること", "前の思考と状況履歴を元に思考する"),
        ]
    
    def カスタム出力(self)->str:
        raise NotImplementedError("カスタム出力は実装されていません")

    

    

class 浅い思考部署:
    _llmBox: 切り替え可能LLMBox
    def __init__(self):
        _llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.浅い思考)

    async def 思考を進める(self, v状況履歴: 状況履歴, 前の思考:思考履歴) -> 思考状態:
        v思考内容プロキシ = 思考内容プロキシ(v状況履歴, 前の思考)
        thinkNode:ThinkNode = ThinkNode(
            ノード名="思考ノード",
            考えるべき内容=v思考内容プロキシ.json文字列で出力(),
            前に終わらせるべき思考ノードのノード名=[],
        )
        v思考ノード:思考ノード = 思考ノード(thinkNode)
        await v思考ノード.実行()
        new思考状態:思考状態 = 思考状態(最終思考ノード = [v思考ノード])
        return new思考状態