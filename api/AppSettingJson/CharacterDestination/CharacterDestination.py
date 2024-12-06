from pydantic import BaseModel

from api.Extend.BaseModel.BaseModelList import BaseModelList
from api.gptAI.HumanInfoValueObject import CharacterName


class CharacterDestination(BaseModel):
    キャラ名: str
    短期目標: str
    中期目標: str
    長期目標: str

class CharacterDestinationCollectionUnit(BaseModel):
    key: CharacterName
    value: CharacterDestination

class CharacterDestinationList(BaseModelList[CharacterDestinationCollectionUnit]):
    pass



