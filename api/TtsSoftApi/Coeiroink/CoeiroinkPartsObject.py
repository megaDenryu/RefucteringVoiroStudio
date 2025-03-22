from typing import TypedDict


class CoeiroinkWavRange(TypedDict):
    start: int
    end: int

class CoeiroinkPhonemePitch(TypedDict):
    phoneme: str
    wavRange: CoeiroinkWavRange

class CoeiroinkMoraDuration(TypedDict):
    mora: str
    hira: str
    phonemePitches: list[CoeiroinkPhonemePitch]
    wavRange: CoeiroinkWavRange

class CoeiroinkWaveData(TypedDict):
    wavBase64: str
    moraDurations: list[CoeiroinkMoraDuration]

class CoeiroinkStyle(TypedDict):
    styleName: str
    styleId: int
    base64Icon: str
    base64Portrait: str

class CoeiroinkSpeaker(TypedDict):
    speakerName: str
    speakerUuid: str
    styles: list[CoeiroinkStyle]
    version: str
    base64Portrait: str