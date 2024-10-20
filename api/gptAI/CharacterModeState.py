
from typing import TypeAlias

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterName, HumanImage, SelectCharacterState, VoiceMode, TTSSoftwareType
from api.gptAI.VoiceController import VoiceState
from uuid import uuid4

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
    
    @staticmethod
    def new(select_character_state: SelectCharacterState) -> "CharacterModeState":
        return CharacterModeState(
            id=uuid4().int,
            tts_software=select_character_state.tts_software,
            character_name=select_character_state.character_name,
            human_image=select_character_state.human_image,
            voice_mode=select_character_state.voice_mode,
            voice_state=None
        )
    
    @staticmethod
    def newFromFrontName(front_name: str) -> "CharacterModeState":
        #ニックネームからキャラクターを生成する
        manager = AllHumanInformationManager.singleton()
        chara_name = manager.nick_names_manager.getCharacterName(front_name)
        if chara_name is None:
            ExtendFunc.ExtendPrint("キャラクターが見つかりませんでした")
            raise ValueError("キャラクターが見つかりませんでした")
        
        # キャラクターのでふぁるとモードとデフォルト画像などを取得
        # デフォルトが存在しない場合について検討（画像がないなど）

        

        
    
    