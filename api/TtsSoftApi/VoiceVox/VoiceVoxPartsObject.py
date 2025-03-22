from typing import TypedDict
from typing_extensions import Literal


class SpeakerStyle(TypedDict):
    id:int
    name:str
    type:Literal["talk"]
class SpeakerInfo(TypedDict):
    name:str
    styles:list[SpeakerStyle]