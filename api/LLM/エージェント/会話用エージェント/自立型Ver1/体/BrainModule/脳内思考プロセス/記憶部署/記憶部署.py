from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考状態.I思考状態 import I思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.保存済み記憶課.保存済み記憶課 import 保存済み記憶課
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.未保存記憶課.未保存記憶課 import 未保存記憶課
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.記憶整理課.記憶整理課 import 記憶整理課



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
    _v保存済み記憶: 保存済み記憶課 = 保存済み記憶課.modelLoad()
    _v未保存記憶: 未保存記憶課 = 未保存記憶課()
    _記憶整理課: 記憶整理課 = 記憶整理課()

    def __init__(self,) -> None:
        pass

    def 追加(self, 思考状態: IModelDumpAble):
        self._v未保存記憶.追加(思考状態)

    async def 記憶整理して保存(self,記憶: list[IModelDumpAble]):
        await self._記憶整理課.記憶整理(記憶)

    @property
    def 最新の思考状態(self)->未保存記憶課:
        """
        目的：何を話すか考えるための材料としての思考状態を提供する。基本的にこれで提供されたものをもとにキャラクターのしゃべり方に合わせて加工することでしゃべりを実現する。
        """
        return self._v未保存記憶

    def model_dump(self):
        return {
            "長期記憶": self._v保存済み記憶.model_dump(),
            "整理された記憶": self._記憶整理課.model_dump(),
            "短期記憶": self._v未保存記憶.model_dump(),
        }