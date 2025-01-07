from pydantic import BaseModel, Field
from typing import List, Optional, TypedDict

class Mora(BaseModel):
    text: str
    consonant: Optional[str] = None
    consonant_length: float
    vowel: str
    vowel_length: float
    pitch: float

class AccentPhrase(BaseModel):
    moras: List[Mora]
    accent: int
    pause_mora: Optional[Mora] = None
    is_interrogative: bool

class QueryDict(BaseModel):
    accent_phrases: List[AccentPhrase]
    speedScale: float
    pitchScale: float
    intonationScale: float
    volumeScale: float
    prePhonemeLength: float
    postPhonemeLength: float
    outputSamplingRate: int
    outputStereo: bool
    kana: str