from pydantic import BaseModel
from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.計画 import 思考アクション計画する人
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 思考ゴールグラフモデル(Iキャラ依存思考モデル):
    """
    思考ゴールグラフモデルは、思考の過程をグラフ構造で計画し、目標に向かって進むための思考を行うモデルです。
    """
    def __init__(self):
        pass

    async def 実行(self, v状況履歴: 状況履歴, 記憶部署: I記憶部署, vキャラクター情報: I自分の情報コンテナ) -> IModelDumpAble:
        思考計画課長 = 思考アクション計画する人()
        # 計画を立てる
        self._思考グラフ = await 思考計画課長.計画を立てる(v状況履歴, 記憶部署, vキャラクター情報)
        # アクションを実行する
        最終思考ノード = await self._思考グラフ.グラフ実行()
        v思考状態 = 思考状態(最終思考ノード=最終思考ノード)
        return v思考状態
