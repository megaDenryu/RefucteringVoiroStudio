from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態


class 思考結果:
    最新思考状態: 思考状態
    def __init__(self, 最新思考状態: 思考状態) -> None:
        self.最新思考状態 = 最新思考状態

    @property
    def 思考内容(self) -> str:
        """
        思考内容をまとめる
        """
        内容 = ""
        for 思考ノード in self.最新思考状態.最終思考ノードのリスト:
            内容 += 思考ノード.ノード名 + " "
