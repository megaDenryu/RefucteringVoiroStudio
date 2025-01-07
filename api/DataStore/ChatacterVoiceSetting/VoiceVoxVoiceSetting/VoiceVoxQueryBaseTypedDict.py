from pydantic import BaseModel, Field
from typing import List, Optional, TypedDict


class MoraDict(TypedDict):
    text: str
    consonant: Optional[str]
    consonant_length: float
    vowel: str
    vowel_length: float
    pitch: float

class AccentPhraseDict(TypedDict):
    moras: List[MoraDict]
    accent: int
    pause_mora: Optional[MoraDict]
    is_interrogative: bool

class QueryDict(TypedDict):
    accent_phrases: List[AccentPhraseDict]
    speedScale: float
    pitchScale: float
    intonationScale: float
    volumeScale: float
    prePhonemeLength: float
    postPhonemeLength: float
    outputSamplingRate: int
    outputStereo: bool
    kana: str