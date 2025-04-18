from abc import ABC, abstractmethod

from pydantic import BaseModel

from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class Iキャラ依存思考モデル(ABC):
    """
    思考モデルのインターフェース
    """
    @abstractmethod
    async def 実行(self, v状況履歴: 状況履歴, v記憶部署: I記憶部署, vキャラクター情報:I自分の情報コンテナ,追伸:IModelDumpAble|str|None = None) -> IModelDumpAble:
        """
        思考を進める
        """
        pass

