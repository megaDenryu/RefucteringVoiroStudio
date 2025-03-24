from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ


class 思考グラフ:
    _v自分の情報:I自分の情報コンテナ
    def __init__(self, v自分の情報:I自分の情報コンテナ) -> None:
        self._v自分の情報 = v自分の情報


    def 思考を進める(self, 状況履歴: list[状況]) -> 思考状態:
        pass