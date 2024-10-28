
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
    front_name: str | None = None

    def __hash__(self) -> int:
        return hash(self.id)
    
    def __eq__(self, o: object) -> bool:
        if not isinstance(o, CharacterModeState):
            return False
        return self.id == o.id
    
    @staticmethod
    def new(select_character_state: SelectCharacterState) -> "CharacterModeState":
        id = uuid4().int
        ExtendFunc.ExtendPrintWithTitle("キャラクターモードのID", id)
        return CharacterModeState(
            id=id,
            tts_software=select_character_state.tts_software,
            character_name=select_character_state.character_name,
            human_image=select_character_state.human_image,
            voice_mode=select_character_state.voice_mode,
            voice_state=None,
            front_name=None
        )
    
    @staticmethod
    def newFromFrontName(front_name: str) -> "CharacterModeState":
        #ニックネームからキャラクターを生成する
        manager = AllHumanInformationManager.singleton()
        try:
            chara_name = manager.nick_names_manager.getCharacterName(front_name)
            if chara_name is None:
                ExtendFunc.ExtendPrint("キャラクターが見つかりませんでした")
                raise ValueError("キャラクターが見つかりませんでした")
            ExtendFunc.ExtendPrintWithTitle("キャラクターが見つかりました", chara_name)
            # キャラクターのでふぁるとモードとデフォルト画像などを取得
            tts_software = manager.chara_names_manager.getTTSSoftware(chara_name)
            ExtendFunc.ExtendPrintWithTitle("TTSソフトウェア", tts_software)
            human_image = manager.human_images.getDefaultHumanImage(chara_name)
            ExtendFunc.ExtendPrintWithTitle("デフォルト画像", human_image)
            voice_mode = manager.CharaNames2VoiceModeDict_manager.getVoiceMode(chara_name)
            ExtendFunc.ExtendPrintWithTitle("ボイスモード", voice_mode)
            select = SelectCharacterState(tts_software=tts_software, character_name=chara_name, human_image=human_image, voice_mode=voice_mode)
            ExtendFunc.ExtendPrintWithTitle("キャラクターの情報", select)
            try:
                mode = CharacterModeState.new(select)
                ExtendFunc.ExtendPrintWithTitle("キャラクターモード", mode)
                return mode
            except Exception as e:
                ExtendFunc.ExtendPrint(e)
                ExtendFunc.ExtendPrint("キャラクターモードの生成に失敗しました")
                raise ValueError("キャラクターモードの生成に失敗しました")
        # デフォルトが存在しない場合について検討（画像がないなど）
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            ExtendFunc.ExtendPrint("デフォルトが存在しない場合について検討（画像がないなど）")
            raise ValueError("デフォルトが存在しない場合について検討（画像がないなど）")

        

        
    
    