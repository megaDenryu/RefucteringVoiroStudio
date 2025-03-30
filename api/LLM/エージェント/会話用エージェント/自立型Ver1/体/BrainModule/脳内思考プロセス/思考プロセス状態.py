
import uuid

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード, 思考ノードPrimitive


class 思考状態:
    id: str
    最終思考ノードのリスト: list[思考ノード]
    def __init__(self, 最終思考ノード: list[思考ノード]) -> None:
        self.id = str(uuid.uuid4())
        self.最終思考ノードのリスト = 最終思考ノード
    
    def primitive(self) -> list[思考ノードPrimitive]:
        """
        思考状態をprimitiveに変換する
        """
        ret_list:list[思考ノードPrimitive] = []
        for 思考ノード in self.最終思考ノードのリスト:
            思考ノードprimitive = 思考ノード.primitive
            ret_list.append(思考ノードprimitive)
        return ret_list


    @staticmethod
    def 初期思考状態を生成() -> "思考状態":
        思考ノードリスト = [
            思考ノード.初期思考ノードを生成(),
        ]
        return 思考状態(思考ノードリスト)


    

        
