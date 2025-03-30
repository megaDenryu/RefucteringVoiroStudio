
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アローなど.思考アロー import 思考アロー
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノード


class 思考ノードリスト:
    _ノードリスト: list[思考ノード]
    def __init__(self,ノードリスト: list[思考ノード]) -> None:
        self._ノードリスト = ノードリスト
    def ノード名検索(self,ノード名: str) -> 思考ノード:
        for ノード in self._ノードリスト:
            if ノード.ノード名 == ノード名:
                return ノード
        raise ValueError(f"ノード名{ノード名}は存在しません")
    def 思考アローリストを生成(self) -> list[思考アロー]:
        思考アローリスト = []
        for ノード in self._ノードリスト:
            for 前ノード名 in ノード.前に終わらせるべき思考ノードのノード名:
                前ノード = self.ノード名検索(前ノード名)
                思考アローリスト.append(思考アロー(前=前ノード,後=ノード))
        return 思考アローリスト