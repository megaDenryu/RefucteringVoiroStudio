
from typing import TypeAlias

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel
from api.gptAI.HumanInformation import CharacterName, HumanImage, VoiceMode, TTSSoftwareType
from api.gptAI.VoiceController import VoiceState

CharacterId: TypeAlias = int

class CharacterModeState(HashableBaseModel):
    id: CharacterId
    tts_software: TTSSoftwareType
    character_name: CharacterName
    human_image: HumanImage
    voice_mode: VoiceMode
    voice_state: VoiceState | None
    front_name: str

    def __init__(self, id: CharacterId, tts_software: TTSSoftwareType, character_name: CharacterName, human_image: HumanImage, voice_mode: VoiceMode, voice_state: VoiceState | None) -> None:
        self.id = id
        self.tts_software = tts_software
        self.character_name = character_name
        self.human_image = human_image
        self.voice_mode = voice_mode
        self.voice_state = voice_state

    def __hash__(self) -> int:
        return hash(self.id)
    
    def __eq__(self, o: object) -> bool:
        if not isinstance(o, CharacterModeState):
            return False
        return self.id == o.id
    
    