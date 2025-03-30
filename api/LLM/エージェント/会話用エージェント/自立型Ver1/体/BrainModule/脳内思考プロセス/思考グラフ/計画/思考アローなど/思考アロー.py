from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード


class 思考アロー:
    _前: 思考ノード
    _後: 思考ノード
    完了フラグ: bool = False
    def __init__(self,前:思考ノード,後:思考ノード) -> None:
        self._前 = 前
        self._後 = 後