
from enum import Enum
from pathlib import Path
from pydantic import BaseModel, ValidationError
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

class TTSSoftware(Enum):
    CevioAI = "CevioAI"
    VoiceVox = "VoiceVox"
    AIVoice = "AIVoice"
    Coeiroink = "Coeiroink"

class CharacterName(BaseModel):
    name: str



class NickName(BaseModel):
    name: str

class VoiceMode(BaseModel):
    mode: str
    id: int|None

class HumanImage(BaseModel):
    folder_name: str

class NameSpecies(Enum):
    """
    # インスタンスの生成する例
    character_name_instance = NameSpecies.CharaName.value(name="Example Name")
    print(character_name_instance)
    """
    CharaName = CharacterName
    Nickname = NickName
    VoiceMode = VoiceMode
    HumanImage = HumanImage

    @staticmethod
    def is_instance_of_name_species(obj):
        return any(isinstance(obj, species.value) for species in NameSpecies)

class VoiceModeNamesManager:
    api_dir: Path
    voice_mode_names_filepath: dict[TTSSoftware, Path]         # ボイスモード名リストのファイルパス
    voice_mode_list: dict[TTSSoftware, list[VoiceMode]]        # ボイスモード名リスト
    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        
        self.voice_mode_names_filepath = self.createVoiceModeNamesFilePath()
        self.voice_mode_list = self.loadAllVoiceModeNames()

    def createVoiceModeNamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VoiceVox: self.api_dir / "CharSettingJson/VoiceModeNames/VoiceVoxVoiceModes.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/VoiceModeNames/CoeiroinkVoiceModes.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/VoiceModeNames/AIVoiceVoiceModes.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/VoiceModeNames/CevioAIVoiceModes.json"
        }
    
    def loadVoiceModeNames(self, software:TTSSoftware)->list[VoiceMode]:
        path = self.voice_mode_names_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, [])
        voice_modes:list[dict] = ExtendFunc.loadJsonToList(path)
        try:
            return [VoiceMode(**mode) for mode in voice_modes]
        except ValidationError as e:
            raise e

    
    def loadAllVoiceModeNames(self)->dict[TTSSoftware, list[VoiceMode]]:
        all_voice_mode_names = {}
        for software in TTSSoftware:
            voice_modes = self.loadVoiceModeNames(software)
            all_voice_mode_names[software] = voice_modes
        return all_voice_mode_names
    
    def updateVoiceModeNames(self, software:TTSSoftware, voice_modes:list[VoiceMode]):
        path = self.voice_mode_names_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, [])

        # 既存のボイスモードリストとの差分がある場合は更新
        if self.voice_mode_list[software] != voice_modes:
            ExtendFunc.saveListToJson(path, voice_modes)

class CharaNameManager:
    api_dir: Path
    chara_names: dict[TTSSoftware, list[CharacterName]]
    chara_names_filepath: dict[TTSSoftware, Path]
    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.chara_names_filepath = self.createCharaNamesFilePath()
        self.chara_names = self.loadAllCharaNames()
    
    def createCharaNamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VoiceVox: self.api_dir / "CharSettingJson/CharaNames/VoiceVoxNames.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/CharaNames/CoeiroinkNames.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/CharaNames/AIVoiceNames.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/CharaNames/CevioAINames.json"
        }
    
    def loadCharaNames(self, software:TTSSoftware)->list[CharacterName]:
        path = self.chara_names_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, [])
        chara_names:list[str] = ExtendFunc.loadJsonToList(path)
        # chara_namesの型が正常かどうかを確認
        if not isinstance(chara_names, list):
            raise TypeError(f"chara_namesの型が正常ではありません。chara_names:{chara_names}")
        return [CharacterName(name=name) for name in chara_names]
    
    def loadAllCharaNames(self) -> dict[TTSSoftware, list[CharacterName]]:
        all_character_names = {}
        for software in TTSSoftware:
            character_names = self.loadCharaNames(software)
            all_character_names[software] = character_names
        return all_character_names
    
    def updateCharaNames(self, software:TTSSoftware, chara_names:list[CharacterName]):
        """
        キャラネームリストを上書きします。部分更新ではないので注意してください。
        """
        path = self.chara_names_filepath[software]

class  CharaNames2VoiceModeDictManager:
    api_dir: Path
    CharaNames2VoiceModeDict_filepath: dict[TTSSoftware, Path] # キャラ名とボイスモードの対応リストのファイルパス
    chara_names2_voice_modes: dict[TTSSoftware, dict[CharacterName, list[VoiceMode]]]

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.CharaNames2VoiceModeDict_filepath = self.createCharaNames2VoiceModeDictPath()
        self.chara_names2_voice_modes = self.loadAllCharaNames2VoiceModeDict()
    
    def createCharaNames2VoiceModeDictPath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VoiceVox: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/VoiceVoxNames2VoiceMode.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CoeiroinkNames2VoiceMode.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/AIVoiceNames2VoiceMode.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CevioAINames2VoiceMode.json"
        }
    
    def loadCharaNames2VoiceModeDict(self, software:TTSSoftware)->dict[CharacterName, list[VoiceMode]]:
        path = self.CharaNames2VoiceModeDict_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        voice_modes_dict:dict[str, list[str]] = ExtendFunc.loadJsonToDict(path)
        # voice_modesの型が正常かどうかを確認
        for name, voice_modes in voice_modes_dict.items():
            if not isinstance(name, str) or not isinstance(voice_modes, list):
                raise TypeError(f"voice_modesの型が正常ではありません。name:{name}, voice_modes:{voice_modes}")
        return {CharacterName(name=name):[VoiceMode(mode=mode) for mode in voice_modes] for name, voice_modes in voice_modes_dict.items()}
    
    def loadAllCharaNames2VoiceModeDict(self) -> dict[CharacterName, list[VoiceMode]]:
        all_voice_modes = {}
        for software in TTSSoftware:
            voice_modes = self.loadCharaNames2VoiceModeDict(software)
            all_voice_modes.update(voice_modes)
        return all_voice_modes

    def updateCharaNames2VoiceModeDict(self, software:TTSSoftware, voice_modes:dict[CharacterName, list[VoiceMode]]):
        """
        ボイスモードリストを上書きします。部分更新ではないので注意してください。
        # 部分更新ではない理由:
        キャラ名が存在しない場合は新規追加、存在する場合は上書きするため。
        また、元の辞書に存在していて、入力辞書に存在しない場合は削除するため。
        """
        path = self.CharaNames2VoiceModeDict_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, {})
        voice_modes_dict = {chara_name.name:[voice_mode.mode for voice_mode in voice_modes] for chara_name, voice_modes in voice_modes.items()}
        ExtendFunc.saveDictToJson(path, voice_modes_dict)

class NicknamesManager:
    api_dir: Path
    nicknames_filepath: dict[TTSSoftware, Path]                # キャラ名とニックネームの対応リストのファイルパス
    nicknames: dict[TTSSoftware, dict[CharacterName, list[NickName]]]

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.nicknames_filepath = self.createNicknamesFilePath()
        self.nicknames = self.loadAllNicknames()
    
    def createNicknamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VoiceVox: self.api_dir / "CharSettingJson/Nicknames/VoiceVoxNicknames.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/Nicknames/CoeiroinkNicknames.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/Nicknames/AIVoiceNicknames.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/Nicknames/CevioAINicknames.json"
        }
    
    def loadNicknames(self, software:TTSSoftware)->dict[CharacterName, list[NickName]]:
        path = self.nicknames_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        nicknames_dict:dict[str, list[str]] = ExtendFunc.loadJsonToDict(path)
        # nicknamesの型が正常かどうかを確認
        for name, nicknames in nicknames_dict.items():
            if not isinstance(name, str) or not isinstance(nicknames, list):
                raise TypeError(f"nicknamesの型が正常ではありません。name:{name}, nicknames:{nicknames}")
        return {CharacterName(name=name):[NickName(name=nickname) for nickname in nicknames] for name, nicknames in nicknames_dict.items()}
    
    def loadAllNicknames(self) -> dict[CharacterName, list[NickName]]:
        all_nicknames = {}
        for software in TTSSoftware:
            nicknames = self.loadNicknames(software)
            all_nicknames.update(nicknames)
        return all_nicknames
    
    def updateNicknames(self, software:TTSSoftware, nicknames:dict[CharacterName, list[NickName]]):
        """
        ニックネームリストを上書きします。部分更新ではないので注意してください。
        """
        path = self.nicknames_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, {})
        nicknames_dict = {chara_name.name:[nickname.name for nickname in nicknames] for chara_name, nicknames in nicknames.items()}
        ExtendFunc.saveDictToJson(path, nicknames_dict)

class HumanImagesManager:
    api_dir: Path
    human_images_filepath: Path
    human_images: dict[CharacterName, list[HumanImage]]

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.human_images_filepath = self.createHumanImagesFilePath()
        self.human_images = self.loadAllHumanImages()
    
    def createHumanImagesFilePath(self)->Path:
        return self.api_dir / "CharSettingJson/HumanImages/HumanImages.json"
    
    def loadAllHumanImages(self)->dict[CharacterName, list[HumanImage]]:
        path = self.human_images_filepath
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        human_images_dict:dict[str, list[str]] = ExtendFunc.loadJsonToDict(path)
        # human_imagesの型が正常かどうかを確認
        for name, human_images in human_images_dict:
            if not isinstance(name, str) or not isinstance(human_images, list):
                raise TypeError(f"human_imagesの型が正常ではありません。name:{name}, human_images:{human_images}")
        return {CharacterName(name=name):[HumanImage(folder_name=folder_name) for folder_name in human_images] for name, human_images in human_images_dict.items()}
    
    def updateHumanImages(self, human_images:dict[CharacterName, list[HumanImage]]):
        """
        人物画像リストを上書きします。部分更新ではないので注意してください。
        """
        path = self.human_images_filepath
        JsonAccessor.checkExistAndCreateJson(path, {})
        human_images_dict = {chara_name.name:[human_image.folder_name for human_image in human_images] for chara_name, human_images in human_images.items()}
        ExtendFunc.saveDictToJson(path, human_images_dict)

class AllHumanInformationManager:
    instance: "AllHumanInformationManager|None" = None
    api_dir: Path
    voice_mode_names_manager: VoiceModeNamesManager
    chara_names_manager: CharaNameManager
    CharaNames2VoiceModeDict_manager: CharaNames2VoiceModeDictManager
    nick_names_manager: NicknamesManager
    human_images: HumanImagesManager
    
    images: dict[CharacterName, list[HumanImage]]


    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        
        self.voice_mode_names_manager = VoiceModeNamesManager()
        self.chara_names_manager = CharaNameManager()
        self.CharaNames2VoiceModeDict_manager = CharaNames2VoiceModeDictManager()
        self.nick_names_manager = NicknamesManager()
        self.human_images = HumanImagesManager()


        self.images = self.loadImages()
    
    @classmethod
    def singleton(cls)->"AllHumanInformationManager":
        if cls.instance is None:
            cls.instance = cls()
        return cls.instance


    def loadImages(self)->dict[CharacterName, list[HumanImage]]:
        return {}

    

    


class HumanInformation:
    chara_name: CharacterName
    nicknames: list[NickName]
    voice_modes: list[VoiceMode]
    images: list[HumanImage]

    def __init__(self, chara_name:CharacterName):
        self.chara_name = chara_name
        self.nickname = self.loadNicknames(chara_name)
        self.voice_mode = self.loadVoiceModes(chara_name)
        self.images = self.loadImages(chara_name)

    def loadNicknames(self, chara_name:CharacterName)->list[NickName]:
        pass

    def loadVoiceModes(self, chara_name:CharacterName)->list[VoiceMode]:
        pass

    def loadImages(self, chara_name:CharacterName)->list[HumanImage]:
        pass
        

class HumanNameState:
    chara_name: CharacterName
    nickname: NickName
    voice_mode: VoiceMode
    image: HumanImage

    def __init__(self, chara_name:CharacterName, nickname:NickName, voice_mode:VoiceMode):
        self.chara_name = chara_name
        self.nickname = nickname
        self.voice_mode = voice_mode
    

class HumanInformationTest:
    def __init__(self):
        self.test2()


    
    def test2(self):
        name = CharacterName(name="test")
        name2 = CharacterName(name="test")
        print(name == name2)