

from pydantic import BaseModel

from api.Extend.ExtendFunc import B


class EmotionVector(BaseModel):
    プライド: int = 0
    恥: int = 0

class SelfEsteemConfidence(BaseModel):
    #自尊心自信評価
    知識やスキルへの自信: int
    想像力への自信: int
    創造性への自信: int
    対人関係のスキルへの自信: int
    社会的地位への自信: int
    身体的能力への自信: int
    外見への自信: int
    倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信: int
    社会や人類に貢献すること: int
    個性や独自性: int
    自己表現力への自信: int
    感情の安定性への自信: int
    共感力への自信: int

    @classmethod
    def zero(cls) -> "SelfEsteemConfidence":
        return cls(
            知識やスキルへの自信=0,
            想像力への自信=0,
            創造性への自信=0,
            対人関係のスキルへの自信=0,
            社会的地位への自信=0,
            身体的能力への自信=0,
            外見への自信=0,
            倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信=0,
            社会や人類に貢献すること=0,
            個性や独自性=0,
            自己表現力への自信=0,
            感情の安定性への自信=0,
            共感力への自信=0
        )

    def __add__(self, other):
        if isinstance(other, SelfEsteemConfidence):
            return SelfEsteemConfidence(
                知識やスキルへの自信=self.知識やスキルへの自信 + other.知識やスキルへの自信,
                想像力への自信=self.想像力への自信 + other.想像力への自信,
                創造性への自信=self.創造性への自信 + other.創造性への自信,
                対人関係のスキルへの自信=self.対人関係のスキルへの自信 + other.対人関係のスキルへの自信,
                社会的地位への自信=self.社会的地位への自信 + other.社会的地位への自信,
                身体的能力への自信=self.身体的能力への自信 + other.身体的能力への自信,
                外見への自信=self.外見への自信 + other.外見への自信,
                倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信=self.倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信 + other.倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信,
                社会や人類に貢献すること=self.社会や人類に貢献すること + other.社会や人類に貢献すること,
                個性や独自性=self.個性や独自性 + other.個性や独自性,
                自己表現力への自信=self.自己表現力への自信 + other.自己表現力への自信,
                感情の安定性への自信=self.感情の安定性への自信 + other.感情の安定性への自信,
                共感力への自信=self.共感力への自信 + other.共感力への自信
            )
        return NotImplemented

class ExternalRecognition(BaseModel):
    愛: int
    友情: int
    尊敬: int
    信頼: int
    感謝: int
    認められること: int
    ユーモアがあること: int
    面白いことを言うこと: int

    @classmethod
    def zero(cls) -> "ExternalRecognition":
        return cls(
            愛=0,
            友情=0,
            尊敬=0,
            信頼=0,
            感謝=0,
            認められること=0,
            ユーモアがあること=0,
            面白いことを言うこと=0
        )

    def __add__(self, other):
        if isinstance(other, ExternalRecognition):
            return ExternalRecognition(
                愛=self.愛 + other.愛,
                友情=self.友情 + other.友情,
                尊敬=self.尊敬 + other.尊敬,
                信頼=self.信頼 + other.信頼,
                感謝=self.感謝 + other.感謝,
                認められること=self.認められること + other.認められること,
                ユーモアがあること=self.ユーモアがあること + other.ユーモアがあること,
                面白いことを言うこと=self.面白いことを言うこと + other.面白いことを言うこと
            )
        return NotImplemented

class PhysicalCost(BaseModel):
    お金: int
    時間: int
    資源: int

    @classmethod
    def zero(cls) -> "PhysicalCost":
        return cls(
            お金=0,
            時間=0,
            資源=0
        )

    def __add__(self, other):
        if isinstance(other, PhysicalCost):
            return PhysicalCost(
                お金=self.お金 + other.お金,
                時間=self.時間 + other.時間,
                資源=self.資源 + other.資源
            )
        return NotImplemented

class Benefit(BaseModel):
    精神エネルギー: int
    肉体エネルギー: int
    色々なことへの自尊心自信評価: SelfEsteemConfidence
    他者からの名誉: ExternalRecognition
    物理的コスト: PhysicalCost

    @classmethod
    def zero(cls) -> "Benefit":
        return cls(
            精神エネルギー=1,
            肉体エネルギー=1,
            色々なことへの自尊心自信評価=SelfEsteemConfidence.zero(),
            他者からの名誉=ExternalRecognition.zero(),
            物理的コスト=PhysicalCost.zero()
        )

    def __add__(self, other):
        if isinstance(other, Benefit):
            return Benefit(
                精神エネルギー=self.精神エネルギー + other.精神エネルギー,
                肉体エネルギー=self.肉体エネルギー + other.肉体エネルギー,
                色々なことへの自尊心自信評価=self.色々なことへの自尊心自信評価 + other.色々なことへの自尊心自信評価,
                他者からの名誉=self.他者からの名誉 + other.他者からの名誉,
                物理的コスト=self.物理的コスト + other.物理的コスト
            )
        return NotImplemented