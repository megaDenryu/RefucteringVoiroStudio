from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.I思考状態 import I思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署


class 記憶部署(I記憶部署):
    """
    記憶の構造は広義の知識として考えられるものと、過去の状態を知識として持っておけばよくて今の値が大事な状態として考えられるものがある。
    - 報酬：報酬ベクトルという型として持つ必要がある。
    - 状況：状況の履歴として持つ必要がある
    - 思考：今やってる思考は[自問自答,連想,専門家との会話で結論を出す,各種モデルを用いた思考]がある。しかし、疑問と想像と結論へのプロセスと結論を分けて保存して参照できる必要がある
    - 感情：
    - 方針
    - 計画、予定
    - 目標
    - 体験
    - 価値観
    - 知識
    - 経験則
    - ルール
    - 直感
    - 予測
    - 直感
    - 道徳
    などがある。これらはenumとして定義してそれぞれの属性を持ったBaseModelとして持てばよいが、例えば知識のグラフ構造はどうするべきなのか？
    jsonに保存するので保存する前には何かしらのBaseModelとして保持する必要があるのでその型を定義しないといけない。
    ModelDumpableを受け取ってそれを適当にリストで保存し、適宜整理してという形のほうが実装は楽かもしれない。
    """
    思考状態リスト: list[I思考状態]
    def __init__(self, 思考状態リスト: list[I思考状態]) -> None:
        self.思考状態リスト = 思考状態リスト

    def 追加(self, 思考状態: I思考状態):
        self.思考状態リスト.append(思考状態)

    @property
    def 最新の思考状態(self)->I思考状態:
        return self.思考状態リスト[-1]

    def model_dump(self)->list[dict|list]:
        """
        思考状態をprimitiveに変換する
        """
        ret_list:list[dict|list] = []
        for 思考状態 in self.思考状態リスト:
            思考ノードprimitive = 思考状態.model_dump()
            ret_list.append(思考ノードprimitive)
        return ret_list