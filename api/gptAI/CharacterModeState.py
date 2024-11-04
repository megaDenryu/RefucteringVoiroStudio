
from typing import TypeAlias, TypedDict

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import ICharacterName, IHumanImage, IVoiceMode
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterName, HumanImage, VoiceMode, TTSSoftwareType, CharacterId
from api.gptAI.VoiceController import IVoiceState, VoiceState
from uuid import uuid4

class ICharacterModeState(TypedDict):
    id: CharacterId
    tts_software: TTSSoftwareType
    character_name: ICharacterName
    human_image: IHumanImage
    voice_mode: IVoiceMode
    voice_state: IVoiceState
    front_name: str

class CharacterModeState(HashableBaseModel):
    id: CharacterId
    tts_software: TTSSoftwareType
    character_name: CharacterName
    human_image: HumanImage
    voice_mode: VoiceMode
    voice_state: VoiceState
    front_name: str

    def __hash__(self) -> int:
        return hash(self.id)
    
    def __eq__(self, o: object) -> bool:
        if not isinstance(o, CharacterModeState):
            return False
        return self.id == o.id
    
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
            human_image = manager.human_images.getDefaultHumanImage(chara_name)
            voice_mode = manager.CharaNames2VoiceModeDict_manager.getVoiceMode(chara_name)
            try:
                mode = CharacterModeState(id = uuid4().__str__(), tts_software=tts_software, character_name=chara_name, human_image=human_image, voice_mode=voice_mode, voice_state=VoiceState.empty(), front_name=front_name)
                mode.front_name = front_name
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
    
    @staticmethod
    def fromDict(data: ICharacterModeState) -> "CharacterModeState":
        return CharacterModeState(
            id = data["id"], 
            tts_software=data["tts_software"], 
            character_name=CharacterName(**data["character_name"]), 
            human_image=HumanImage(**data["human_image"]), 
            voice_mode=VoiceMode(**data["voice_mode"]), 
            voice_state=VoiceState(**data["voice_state"]), 
            front_name=data["front_name"]
            )
        
    
    