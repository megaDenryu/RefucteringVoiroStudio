from abc import ABC, abstractmethod
from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考ノードなど.思考ノード import 思考ノードPrimitive
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.I思考状態 import I思考状態



class I記憶部署(ABC):
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
    @abstractmethod
    def 追加(self, 思考状態: IModelDumpAble):
        pass

    @abstractmethod
    def 記憶整理(self):
        """
        記憶を整理する
        """
        pass

    @property
    @abstractmethod
    def 最新の思考状態(self)->I思考状態:
        pass

    @abstractmethod
    def model_dump(self)->list[dict|list]:
        pass