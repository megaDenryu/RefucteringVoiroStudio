from typing_extensions import TypedDict
from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel

"""
各ボイロで違うしコントロールしたいものも違うので長考
"""
class VoiceState(HashableBaseModel):
    scale:int

    @staticmethod
    def empty()->'VoiceState':
        return VoiceState(scale=0)


class IVoiceState(TypedDict):
    scale:int
