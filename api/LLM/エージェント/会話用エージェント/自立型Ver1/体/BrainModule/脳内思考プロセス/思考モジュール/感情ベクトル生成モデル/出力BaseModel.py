

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

class ExternalRecognition(BaseModel):
    愛: int
    友情: int
    尊敬: int
    信頼: int
    感謝: int
    認められること: int
    ユーモアがあること: int
    面白いことを言うこと: int

class PhysicalCost(BaseModel):
    お金: int
    時間: int
    資源: int

class Benefit(BaseModel):
    精神エネルギー: int
    肉体エネルギー: int
    色々なことへの自尊心自信評価: SelfEsteemConfidence
    他者からの名誉: ExternalRecognition
    物理的コスト: PhysicalCost