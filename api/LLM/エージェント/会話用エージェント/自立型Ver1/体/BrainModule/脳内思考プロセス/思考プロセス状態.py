
import uuid

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード


class 思考状態:
    id: str
    最終思考ノードのリスト: list[思考ノード]
    def __init__(self, 最終思考ノード: list[思考ノード]) -> None:
        self.id = str(uuid.uuid4())
        self.最終思考ノードのリスト = 最終思考ノード

    @staticmethod
    def 初期思考状態を生成() -> "思考状態":
        """
        思考ノードリストから初期思考状態を生成する
        :param 思考ノードリスト: list[思考ノード]
        :return: 思考状態
        """
        思考ノードリスト = [
            思考ノード.初期思考ノードを生成(),
        ]
        return 思考状態(思考ノードリスト)


    

        
