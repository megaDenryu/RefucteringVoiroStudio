

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel
from api.gptAI.HumanInfoValueObject import CharacterId, CharacterName, CharacterSaveId, TTSSoftwareType, VoiceMode
from api.gptAI.VoiceController import VoiceState


class CharacterModeStateForNoDisplay(HashableBaseModel):
    id: CharacterId
    save_id: CharacterSaveId
    tts_software: TTSSoftwareType
    character_name: CharacterName
    voice_mode: VoiceMode
    voice_state: VoiceState

    def __hash__(self) -> int:
        return hash(self.id)
    
    def __eq__(self, o: object) -> bool:
        if not isinstance(o, CharacterModeStateForNoDisplay):
            return False
        return self.id == o.id