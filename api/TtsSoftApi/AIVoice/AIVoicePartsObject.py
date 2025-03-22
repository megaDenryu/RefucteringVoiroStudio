from typing import Optional
from pydantic import BaseModel


class StyleModel(BaseModel):
    Name: str  # J, A, S
    Value: float

class MergedVoiceModel(BaseModel):
    VoiceName: str

class MergedVoiceContainerModel(BaseModel):
    BasePitchVoiceName: str
    MergedVoices: list[MergedVoiceModel]

class VoicePresetModel(BaseModel):
    """
    AIVoiceEditorのVoicePresetModelをpydanticで定義.
    https://aivoice.jp/manual/editor/API/html/ace2be3b-ee08-3dda-405c-8967e31385cf.htm
    """
    PresetName: str
    VoiceName: str
    Volume: float
    Speed: float
    Pitch: float
    PitchRange: float
    MiddlePause: int
    LongPause: int
    Styles: list[StyleModel]
    MergedVoiceContainer: Optional[MergedVoiceContainerModel]