from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.出力BaseModel import Benefit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import EmotionVector

"""
記憶整理クエリプロキシは、記憶整理のためのクエリを管理するクラスです。

記憶の構造は広義の知識として考えられるものと、過去の状態を知識として持っておけばよくて今の値が大事な状態として考えられるものがある。
- 報酬：報酬ベクトルという型として持つ必要がある。
- 状況：状況の履歴として持つ必要がある
- 思考：今やってる思考は[自問自答,連想,専門家との会話で結論を出す,各種モデルを用いた思考]がある。しかし、疑問と想像と結論へのプロセスと結論を分けて保存して参照できる必要がある
上は
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
class OrganizingMemoryResultBenefitEmotion(BaseModel):
    """
    報酬と感情の記憶
    """
    報酬: Benefit
    感情: EmotionVector
    @classmethod
    def zero(cls) -> "OrganizingMemoryResultBenefitEmotion":
        return OrganizingMemoryResultBenefitEmotion(報酬=Benefit.zero(),感情=EmotionVector.無())

class MemoryAsTheorem(BaseModel):
    命題: str
    真実か否か: str
    証明: str
    性質: str
    具体例: str
    関連事項: str

class OrganizingMemoryAsTheorem(BaseModel):
    人生の定理リスト: list[MemoryAsTheorem]
    def __add__(self, other: "OrganizingMemoryAsTheorem") -> "OrganizingMemoryAsTheorem":
        return OrganizingMemoryAsTheorem(
            人生の定理リスト=self.人生の定理リスト + other.人生の定理リスト
        )
    @classmethod
    def 空(cls) -> "OrganizingMemoryAsTheorem":
        return OrganizingMemoryAsTheorem(人生の定理リスト=[])

class MemoryAsRule(BaseModel):
    ルール: str
    定義: str
    例: str
    関連事項: str

class OrganizingMemoryAsRule(BaseModel):
    人生のルールリスト: list[MemoryAsRule]
    def __add__(self, other: "OrganizingMemoryAsRule") -> "OrganizingMemoryAsRule":
        return OrganizingMemoryAsRule(人生のルールリスト=self.人生のルールリスト + other.人生のルールリスト)
    @classmethod
    def 空(cls) -> "OrganizingMemoryAsRule":
        return OrganizingMemoryAsRule(人生のルールリスト=[])

class MemoryAsConcept(BaseModel):
    概念: str
    定義: str
    特徴: str
    例: str
    関連事項: str

class OrganizingMemoryAsConcept(BaseModel):
    人生の概念リスト: list[MemoryAsConcept]
    def __add__(self, other: "OrganizingMemoryAsConcept") -> "OrganizingMemoryAsConcept":
        return OrganizingMemoryAsConcept(人生の概念リスト=self.人生の概念リスト + other.人生の概念リスト)
    @classmethod
    def 空(cls) -> "OrganizingMemoryAsConcept":
        return OrganizingMemoryAsConcept(人生の概念リスト=[])


class MemoryAsQA(BaseModel):
    # 人生の問と答え
    問: str
    結論へ至る道筋: str
    結論: str
    関連事項: str
class OrganizingMemoryAsQA(BaseModel):
    人生の問と答えリスト: list[MemoryAsQA]
    def __add__(self, other: "OrganizingMemoryAsQA") -> "OrganizingMemoryAsQA":
        return OrganizingMemoryAsQA(人生の問と答えリスト=self.人生の問と答えリスト + other.人生の問と答えリスト)
    @classmethod
    def 空(cls) -> "OrganizingMemoryAsQA":
        return OrganizingMemoryAsQA(人生の問と答えリスト=[])

class MemoryAsLifeInsight(BaseModel):
    # 人生の洞察
    方針: list[str]
    計画: list[str]
    目標: list[str]
    新たな問い: list[str]
    体験したこと: list[str]
    価値観: list[str]
    道徳: list[str]

    def __add__(self, other: "MemoryAsLifeInsight") -> "MemoryAsLifeInsight":
        return MemoryAsLifeInsight(
            方針=self.方針 + other.方針,
            計画=self.計画 + other.計画,
            目標=self.目標 + other.目標,
            新たな問い=self.新たな問い + other.新たな問い,
            体験したこと=self.体験したこと + other.体験したこと,
            価値観=self.価値観 + other.価値観,
            道徳=self.道徳 + other.道徳
        )
    @classmethod
    def 空(cls) -> "MemoryAsLifeInsight":
        return MemoryAsLifeInsight(方針=[],計画=[],目標=[],新たな問い=[],体験したこと=[],価値観=[],道徳=[])

class OrganizingMemoryResult(BaseModel):
    報酬感情: OrganizingMemoryResultBenefitEmotion
    人生での定理:OrganizingMemoryAsTheorem
    人生のルール:OrganizingMemoryAsRule
    概念:OrganizingMemoryAsConcept
    人生での問と答え:OrganizingMemoryAsQA
    人生からの洞察:MemoryAsLifeInsight

    def 報酬感情のみ上書きしてマージ(self, other: "OrganizingMemoryResult") -> "OrganizingMemoryResult":
        return OrganizingMemoryResult(
            報酬感情= other.報酬感情,
            人生での定理=self.人生での定理 + other.人生での定理,
            人生のルール=self.人生のルール + other.人生のルール,
            概念=self.概念 + other.概念,
            人生での問と答え=self.人生での問と答え + other.人生での問と答え,
            人生からの洞察=self.人生からの洞察 + other.人生からの洞察
        )
    @classmethod
    def 空(cls) -> "OrganizingMemoryResult":
        return OrganizingMemoryResult(
            報酬感情=OrganizingMemoryResultBenefitEmotion.zero(),
            人生での定理=OrganizingMemoryAsTheorem.空(),
            人生のルール=OrganizingMemoryAsRule.空(),
            概念=OrganizingMemoryAsConcept.空(),
            人生での問と答え=OrganizingMemoryAsQA.空(),
            人生からの洞察=MemoryAsLifeInsight.空()
        )


    
    