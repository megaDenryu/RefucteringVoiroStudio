
from enum import Enum
from pathlib import Path
from pydantic import BaseModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

class TTSSoftware(Enum):
    CevioAI = "CevioAI"
    VOICEVOX = "VOICEVOX"
    AIVoice = "AIVoice"
    Coeiroink = "Coeiroink"

class CharacterName(BaseModel):
    name: str

class NickName(BaseModel):
    name: str

class VoiceMode(BaseModel):
    mode: str

class HumanImage(BaseModel):
    name: str

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


class AllHumanInformationManager:
    instance: "AllHumanInformationManager|None" = None
    api_dir: Path

    voice_mode_names_filepath: dict[TTSSoftware, Path]         # ボイスモード名リストのファイルパス
    chara_names_filepath: dict[TTSSoftware, Path]              # キャラ名リストのファイルパス
    CharaNames2VoiceModeDict_filepath: dict[TTSSoftware, Path] # キャラ名とボイスモードの対応リストのファイルパス
    nicknames_filepath: dict[TTSSoftware, Path]                # キャラ名とニックネームの対応リストのファイルパス

    voice_mode_list: dict[TTSSoftware, list[VoiceMode]]
    chara_names: dict[TTSSoftware, list[CharacterName]]

    nicknames: dict[CharacterName, list[NickName]]
    voice_modes: dict[CharacterName, list[VoiceMode]]
    images: dict[CharacterName, list[HumanImage]]


    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        
        self.voice_mode_names_filepath = self.createVoiceModeNamesFilePath()
        self.chara_names_filepath = self.createCharaNamesFilePath()
        self.CharaNames2VoiceModeDict_filepath = self.createCharaNames2VoiceModeDictPath()
        self.nicknames_filepath = self.createNicknamesFilePath()

        self.voice_mode_list = self.loadAllVoiceModeNames()

        self.chara_names = self.loadAllCharaNames()
        self.nicknames = self.loadAllNicknames()
        self.voice_modes = self.loadAllCharaNames2VoiceModeDict()
        self.images = self.loadImages()
    
    @classmethod
    def singleton(cls)->"AllHumanInformationManager":
        if cls.instance is None:
            cls.instance = cls()
        return cls.instance
    
    
    def createVoiceModeNamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VOICEVOX: self.api_dir / "CharSettingJson/VoiceModeNames/VoiceVoxVoiceModes.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/VoiceModeNames/CoeiroinkVoiceModes.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/VoiceModeNames/AIVoiceVoiceModes.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/VoiceModeNames/CevioAIVoiceModes.json"
        }
    
    
    def createCharaNamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VOICEVOX: self.api_dir / "CharSettingJson/CharaNames/VoiceVoxNames.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/CharaNames/CoeiroinkNames.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/CharaNames/AIVoiceNames.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/CharaNames/CevioAINames.json"
        }
    
    def createCharaNames2VoiceModeDictPath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VOICEVOX: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/VoiceVoxNames2VoiceMode.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CoeiroinkNames2VoiceMode.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/AIVoiceNames2VoiceMode.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CevioAINames2VoiceMode.json"
        }
    
    
    def createNicknamesFilePath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VOICEVOX: self.api_dir / "CharSettingJson/Nicknames/VoiceVoxNicknames.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/Nicknames/CoeiroinkNicknames.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/Nicknames/AIVoiceNicknames.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/Nicknames/CevioAINicknames.json"
        }
        
    def loadVoiceModeNames(self, software:TTSSoftware)->list[VoiceMode]:
        path = self.voice_mode_names_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, [])
        voice_modes:list[str] = ExtendFunc.loadJsonToList(path)
        # voice_modesの型が正常かどうかを確認
        if not isinstance(voice_modes, list):
            raise TypeError(f"voice_modesの型が正常ではありません。voice_modes:{voice_modes}")
        return [VoiceMode(mode=mode) for mode in voice_modes]
    
    def loadAllVoiceModeNames(self)->dict[TTSSoftware, list[VoiceMode]]:
        all_voice_mode_names = {}
        for software in TTSSoftware:
            voice_modes = self.loadVoiceModeNames(software)
            all_voice_mode_names[software] = voice_modes
        return all_voice_mode_names
    
    def updateVoiceModeNames(self, software:TTSSoftware, voice_modes:list[str]):
        path = self.voice_mode_names_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, [])

        # 既存のボイスモードリストとの差分がある場合は更新
        tmp_voice_modes:list[VoiceMode] = [VoiceMode(mode=mode) for mode in voice_modes]
        if self.voice_mode_list[software] != tmp_voice_modes:
            ExtendFunc.saveListToJson(path, voice_modes)
    
    
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
        JsonAccessor.checkExistAndCreateJson(path, [])
        ExtendFunc.saveListToJson(path, [chara_name.name for chara_name in chara_names])

        
        

   

    def loadNicknames(self,software:TTSSoftware)->dict[CharacterName, list[NickName]]:
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

    def loadCharaNames2VoiceModeDict(self,software:TTSSoftware)->dict[CharacterName, list[VoiceMode]]:
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
        """
        path = self.CharaNames2VoiceModeDict_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, {})
        voice_modes_dict = {chara_name.name:[voice_mode.mode for voice_mode in voice_modes] for chara_name, voice_modes in voice_modes.items()}
        ExtendFunc.saveDictToJson(path, voice_modes_dict)


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