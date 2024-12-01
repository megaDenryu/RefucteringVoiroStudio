from typing_extensions import TypedDict

from api.gptAI.HumanInfoValueObject import ICharacterName


class D_CharacterAISetting(TypedDict):
    pass



class CharacterAISettingCollectionUnit(TypedDict):
    key: ICharacterName
    value: D_CharacterAISetting