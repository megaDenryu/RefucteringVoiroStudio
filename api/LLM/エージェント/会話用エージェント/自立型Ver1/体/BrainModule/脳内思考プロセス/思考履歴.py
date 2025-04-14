from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノードPrimitive
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.思考プロセス状態 import 思考状態


class 思考履歴:
    思考状態リスト: list[思考状態]
    def __init__(self, 思考状態リスト: list[思考状態]) -> None:
        self.思考状態リスト = 思考状態リスト

    def 追加(self, 思考状態: 思考状態):
        self.思考状態リスト.append(思考状態)

    @property
    def 最新の思考状態(self)->思考状態:
        return self.思考状態リスト[-1]

    def model_dump(self)-> list[list[思考ノードPrimitive]]:
        """
        思考状態をprimitiveに変換する
        """
        ret_list:list[list[思考ノードPrimitive]] = []
        for 思考状態 in self.思考状態リスト:
            思考ノードprimitive = 思考状態.model_dump()
            ret_list.append(思考ノードprimitive)
        return ret_list
        