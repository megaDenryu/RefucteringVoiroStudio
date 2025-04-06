from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況履歴


class 方針策定input:
    v状況履歴:状況履歴
    def __init__(self, v状況履歴:状況履歴) -> None:
        self.v状況履歴 = v状況履歴