



import asyncio
from typing import Coroutine
import uuid


from api import LLM
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.LLMリクエスト用BaseModel import ThinkGraph, ThinkNode
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アローなど.思考アロー import 思考アロー
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アローなど.思考アローリスト import 思考アローリスト
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノードリスト import 思考ノードリスト











class 思考グラフ:
    _全てのノード: 思考ノードリスト
    _全てのアロー: 思考アローリスト
    _グラフの第一ステップ: list[思考ノード] = []
    _グラフの最終ステップ: list[思考ノード] = []
    def __init__(self,グラフ情報: ThinkGraph) -> None:
        self._全てのノード = 思考ノードリスト(self._ノードを作成する(グラフ情報))
        self._全てのアロー = 思考アローリスト(self._全てのノード.思考アローリストを生成())
        self._グラフの第一ステップ = self.グラフ実行ステップを生成()

    def _ノードを作成する(self,グラフ情報: ThinkGraph) -> list[思考ノード]:
        ノードリスト = []
        thinkNode = グラフ情報.思考グラフ
        for node in thinkNode:
            ノードリスト.append(思考ノード(node))
        return ノードリスト


    def グラフ実行ステップを生成(self):
        全ステップ = []
        第一ステップ = []
        for ノード in self._全てのノード._ノードリスト:
            if len(ノード.前に終わらせるべき思考ノードのノード名) == 0:
                第一ステップ.append(ノード)
        全ステップ.append(第一ステップ)
        return 全ステップ

    async def グラフ実行(self)->list[思考ノード]:
        """
        グラフ実行ステップを生成し、グラフを実行する
        """
        実行taskリスト:list[Coroutine] = []
        for ノード in self._グラフの第一ステップ:
            実行taskリスト.append(self._ノードを実行したときの処理(ノード))
        await asyncio.gather(*実行taskリスト)
        return self._グラフの最終ステップ
        
    
    async def _ノードを実行したときの処理(self,ノード:思考ノード):
        # ノードを実行したときの処理
        # ノードが後になってる全てのアローを確認して、全てのアローが完了している場合、ノードを実行する
        前のアローリスト:list[思考アロー] = self._全てのアロー.後が一致するアローを検索(ノード)
        for アロー in 前のアローリスト:
            if アロー.完了フラグ == False:
                return

        # 1. ノードの結果を取得
        結果 = await ノード.実行()
        # 2. 結果をもとに、次のノードを実行する
        次のアローリスト= self._全てのアロー.前が一致するアローを検索(ノード)
        if len(次のアローリスト) == 0:
            # 次のノードがない場合、処理を終了する
            self._グラフの最終ステップ.append(ノード)
            return
        次の実行taskリスト:list[Coroutine] = []
        for アロー in 次のアローリスト:
            if アロー.完了フラグ == False:
                アロー.完了フラグ = True
                coroutine = アロー._後.実行()
                次の実行taskリスト.append(coroutine)
        # 3. 次のノードを実行する
        await asyncio.gather(*次の実行taskリスト)


    

