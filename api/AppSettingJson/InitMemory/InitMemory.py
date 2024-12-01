from typing import Literal
from pydantic import BaseModel
from typing_extensions import TypedDict

from api.gptAI.HumanBaseModel import 目標と利益ベクトル
from api.gptAI.HumanInfoValueObject import CharacterName, ICharacterName
from api.gptAI.ThirdPersonEvaluation import ThirdPersonEvaluationInput


class D_InitMemory(TypedDict):
    目標と利益ベクトル: 目標と利益ベクトル
    第三者評価: ThirdPersonEvaluationInput

class B_InitMemory(BaseModel):
    目標と利益ベクトル: 目標と利益ベクトル
    第三者評価: ThirdPersonEvaluationInput
    
class InitMemoryCollectionUnit(TypedDict):
    key: ICharacterName
    value: D_InitMemory





