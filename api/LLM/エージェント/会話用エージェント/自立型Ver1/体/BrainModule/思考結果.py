from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態


class 思考結果:
    最新思考状態: 思考状態
    def __init__(self, 最新思考状態: 思考状態) -> None:
        self.最新思考状態 = 最新思考状態

    def model_dump(self):
        """
        モデルをダンプする
        """
        return {
            "最新思考状態": self.最新思考状態.primitive(),
        }


    
