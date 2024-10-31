from enum import Enum
from typing import Literal, TypeAlias, TypedDict

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel


TTSSoftwareType: TypeAlias = Literal["CevioAI", "VoiceVox", "AIVoice", "Coeiroink"]

class TTSSoftware(Enum):
    CevioAI = "CevioAI"
    VoiceVox = "VoiceVox"
    AIVoice = "AIVoice"
    Coeiroink = "Coeiroink"

    @staticmethod
    def get_all_software_names() -> list[TTSSoftwareType]:
        return [software.value for software in TTSSoftware]
    
    @staticmethod
    def get_all_software() -> list["TTSSoftware"]:
        return [TTSSoftware(software) for software in TTSSoftware]
    
    @staticmethod
    def toType(ttsSotWare:"TTSSoftware")->TTSSoftwareType:
        return ttsSotWare.value
    @staticmethod
    def fromType(ttsSotWareType:TTSSoftwareType)->"TTSSoftware":
        for ttsSoftware in TTSSoftware:
            if ttsSoftware.value == ttsSotWareType:
                return TTSSoftware(ttsSotWareType)
        raise ValueError(f"TTSSoftwareに{ttsSotWareType}は存在しません。")
    def equal(self, ttsSoftware:TTSSoftwareType)->bool:
        return self.value == ttsSoftware

class CharacterName(HashableBaseModel):
    name: str

class ICharacterName(TypedDict):
    name: str

class NickName(HashableBaseModel):
    name: str

class INickName(TypedDict):
    name: str

class VoiceMode(HashableBaseModel):
    mode: str
    id: int|None = None
    id_str: str|None = None

class IVoiceMode(TypedDict):
    mode: str
    id: int|None
    id_str: str|None

class HumanImage(HashableBaseModel):
    folder_name: str

class IHumanImage(TypedDict):
    folder_name: str

class NameSpecies(Enum):
    """
    # インスタンスの生成する例
    character_name_instance = NameSpecies.CharaName.value(name="Example Name")
    print(character_name_instance)
    """
    CharaName = CharacterName
    Nickname = NickName
    VoiceMode = VoiceMode
    HumanImage = HumanImage

    @staticmethod
    def is_instance_of_name_species(obj):
        return any(isinstance(obj, species.value) for species in NameSpecies)