
from enum import Enum
from pathlib import Path
from typing import Literal, TypeAlias, TypedDict
from pydantic import BaseModel, ValidationError
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel, Map
from api.Extend.ExtendFunc import ExtendFunc
from api.images.image_manager.HumanPart import HumanPart

TTSSoftwareType: TypeAlias = Literal["CevioAI", "VoiceVox", "AIVoice", "Coeiroink"]

class TTSSoftware(Enum):
    CevioAI = "CevioAI"
    VoiceVox = "VoiceVox"
    AIVoice = "AIVoice"
    Coeiroink = "Coeiroink"

    @staticmethod
    def get_all_software_names() -> list[TTSSoftwareType]:
        return [software.value for software in TTSSoftware]
    
    @staticmethod
    def toType(ttsSotWare:"TTSSoftware")->TTSSoftwareType:
        return ttsSotWare.value
    @staticmethod
    def fromType(ttsSotWareType:TTSSoftwareType)->"TTSSoftware":
        for ttsSoftware in TTSSoftware:
            if ttsSoftware.value == ttsSotWareType:
                return TTSSoftware(ttsSotWareType)
        raise ValueError(f"TTSSoftwareに{ttsSotWareType}は存在しません。")

class CharacterName(HashableBaseModel):
    name: str

class ICharacterName(TypedDict):
    name: str

class NickName(HashableBaseModel):
    name: str

class INickName(TypedDict):
    name: str

class VoiceMode(HashableBaseModel):
    mode: str
    id: int|None = None
    id_str: str|None = None

class IVoiceMode(TypedDict):
    mode: str
    id: int|None
    id_str: str|None

class HumanImage(HashableBaseModel):
    folder_name: str

class IHumanImage(TypedDict):
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
        JsonAccessor.checkExistAndCreateJson(path, [])
        chara_names_list = [chara_name.name for chara_name in chara_names]
        ExtendFunc.saveListToJson(path, chara_names_list)

class CharaNamaeVoiceModePair(BaseModel):
    chara_name: CharacterName
    voice_modes: list[VoiceMode]

class ICharaNamaeVoiceModePair(TypedDict):
    chara_name: ICharacterName
    voice_modes: list[IVoiceMode]

class CharaNamaeVoiceModePairList(BaseModel):
    charaNameAndVoiceModesPair: list[CharaNamaeVoiceModePair]


class  CharaNames2VoiceModeDictManager:
    api_dir: Path
    CharaNames2VoiceModeDict_filepath: dict[TTSSoftware, Path] # キャラ名とボイスモードの対応リストのファイルパス
    charaNameAndVoiceModesPairList: CharaNamaeVoiceModePairList

    @property
    def chara_names2_voice_modes(self)->dict[CharacterName, list[VoiceMode]]:
        return {pair.chara_name:pair.voice_modes for pair in self.charaNameAndVoiceModesPairList.charaNameAndVoiceModesPair}

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.CharaNames2VoiceModeDict_filepath = self.createCharaNames2VoiceModeDictPath()
        self.charaNameAndVoiceModesPairList = self.loadAllCharaNames2VoiceModeDict()
    
    def createCharaNames2VoiceModeDictPath(self)->dict[TTSSoftware, Path]:
        return {
            TTSSoftware.VoiceVox: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/VoiceVoxNames2VoiceMode.json",
            TTSSoftware.Coeiroink: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CoeiroinkNames2VoiceMode.json",
            TTSSoftware.AIVoice: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/AIVoiceNames2VoiceMode.json",
            TTSSoftware.CevioAI: self.api_dir / "CharSettingJson/CharaNames2VoiceMode/CevioAINames2VoiceMode.json"
        }
    
    def loadCharaNames2VoiceModeDict(self, software:TTSSoftware)->CharaNamaeVoiceModePairList:
        path = self.CharaNames2VoiceModeDict_filepath[software]
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, None)
        voice_modes_dict:CharaNamaeVoiceModePairList|None = ExtendFunc.loadJsonToBaseModel(path, CharaNamaeVoiceModePairList)
        if voice_modes_dict is None:
            return CharaNamaeVoiceModePairList(charaNameAndVoiceModesPair=[])
        return voice_modes_dict
    
    def loadAllCharaNames2VoiceModeDict(self) -> CharaNamaeVoiceModePairList:
        all_voice_modes = []
        for software in TTSSoftware:
            voice_modes = self.loadCharaNames2VoiceModeDict(software)
            all_voice_modes += voice_modes.charaNameAndVoiceModesPair
        return CharaNamaeVoiceModePairList(charaNameAndVoiceModesPair=all_voice_modes)

    def updateCharaNames2VoiceModeDict(self, software:TTSSoftware, voice_modes:dict[CharacterName, list[VoiceMode]]):
        """
        ボイスモードリストを上書きします。部分更新ではないので注意してください。
        # 部分更新ではない理由:
        キャラ名が存在しない場合は新規追加、存在する場合は上書きするため。
        また、元の辞書に存在していて、入力辞書に存在しない場合は削除するため。
        """
        path = self.CharaNames2VoiceModeDict_filepath[software]
        JsonAccessor.checkExistAndCreateJson(path, {})
        voice_mode_list = [CharaNamaeVoiceModePair(chara_name=chara_name, voice_modes=voice_modes[chara_name]) for chara_name in voice_modes]
        ExtendFunc.saveBaseModelToJson(path, CharaNamaeVoiceModePairList(charaNameAndVoiceModesPair=voice_mode_list))

class NicknamesManager:
    """
    持っていないキャラクターに対しても最初からある程度ニックネームが実装しておく。
    そしてキャラクターを取り出したときにボイスモード辞書にキーがないキャラクターは仕様化のではないと判断するようにする。
    """
    api_dir: Path
    nicknames_filepath: Path                # キャラ名とニックネームの対応リストのファイルパス
    namelistForhumanJson_filepath: Path
    nicknames: dict[CharacterName, list[NickName]]
    nickname2Charaname: dict[NickName,CharacterName]

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.nicknames_filepath = self.api_dir / "CharSettingJson/NickNames.json"
        self.namelistForhumanJson_filepath = self.api_dir / "CharSettingJson/NameListForHuman.json"
        self.nicknames = self.loadNicknames()
        self.nickname2Charaname = self.loadNickname2Charaname()
    
    def loadNicknames(self)->dict[CharacterName, list[NickName]]:
        path = self.nicknames_filepath
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        nicknames_dict:dict[str, list[str]] = ExtendFunc.loadJsonToDict(path)
        # nicknamesの型が正常かどうかを確認
        for name, nicknames in nicknames_dict.items():
            if not isinstance(name, str) or not isinstance(nicknames, list):
                raise TypeError(f"nicknamesの型が正常ではありません。name:{name}, nicknames:{nicknames}")
        return {CharacterName(name=name):[NickName(name=nickname) for nickname in nicknames] for name, nicknames in nicknames_dict.items()}

    def loadNickname2Charaname(self)->dict[NickName,CharacterName]:
        path = self.namelistForhumanJson_filepath
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        nickname2Charaname_dict:dict[str, str] = ExtendFunc.loadJsonToDict(path)
        # nicknamesの型が正常かどうかを確認
        for nickname, charaname in nickname2Charaname_dict.items():
            if not isinstance(nickname, str) or not isinstance(charaname, str):
                raise TypeError(f"nicknamesの型が正常ではありません。name:{nickname}, nicknames:{charaname}")
        return {NickName(name=nickname):CharacterName(name=charaname) for nickname, charaname in nickname2Charaname_dict.items()}
        
    
    def tryAddCharacterNameKey(self, charaNames:list[CharacterName]):
        """
        humanlistを取得してNickNames辞書にキーがないキャラ名があった場合はキーを追加する
        """
        all_manager = AllHumanInformationManager.singleton()
        charaNameList = all_manager.chara_names_manager.chara_names
        for charaName in charaNames:
            if charaName not in charaNameList or charaName not in self.nicknames:
                #ファイルパス一覧に追加する
                self.nicknames[charaName] = [NickName(name = charaName.name)]
        
        #上書き保存する
        self.updateNicknames(self.nicknames)
        #辞書の関係を逆にした辞書を作成
        self.updateNickName2CharaName(self.nicknames)    

    def updateNickName2CharaName(self, nicknames: dict[CharacterName,list[NickName]]):
        """
        ニックネームからキャラ名への辞書を更新します。
        新しく作ったニックネームリストをもとに、ニックネームからキャラ名への辞書を更新します。
        既に存在するニックネームは更新されません。新しいニックネームのみ追加されます。
        """
        
        for chara_name,nickname_list in nicknames.items():
            for nickname in nickname_list:
                if nickname not in self.nickname2Charaname:
                    self.nickname2Charaname[nickname] = chara_name
        path = self.namelistForhumanJson_filepath
        JsonAccessor.checkExistAndCreateJson(path, {})
        nickname2Charaname_dict = {nickname.name:chara_name.name for nickname, chara_name in self.nickname2Charaname.items()}
        ExtendFunc.saveDictToJson(path, nickname2Charaname_dict)
    
    def updateNicknames(self, nicknames:dict[CharacterName, list[NickName]]):
        """
        ニックネームリストを上書きします。部分更新ではないので注意してください。
        """
        path = self.nicknames_filepath
        JsonAccessor.checkExistAndCreateJson(path, {})
        nicknames_dict = {chara_name.name:[nickname.name for nickname in nicknames] for chara_name, nicknames in nicknames.items()}
        ExtendFunc.saveDictToJson(path, nicknames_dict)

    @staticmethod
    def transformNickName2CharaName(nicknames:dict[CharacterName, list[NickName]]):
        """
        キャラ名からニックネームへの辞書を、ニックネームからキャラ名への辞書に変換します。
        """
        tmp_nickname2Charaname:dict[NickName,CharacterName] = {}
        for chara_name,nickname_list in nicknames.items():
            for nickname in nickname_list:
                tmp_nickname2Charaname[nickname] = chara_name
        return tmp_nickname2Charaname
    
    @staticmethod
    def transformCharaName2NickName(nicknames:dict[NickName,CharacterName]):
        """
        ニックネームからキャラ名への辞書を、キャラ名からニックネームへの辞書に変換します。
        """
        tmp_charaname2nickname:dict[CharacterName, list[NickName]] = {}
        #キャラ名からニックネームへの辞書を作成
        for charaname in nicknames.values():
            if charaname not in tmp_charaname2nickname:
                tmp_charaname2nickname[charaname] = []
        for nickname,charaname in nicknames.items():
            tmp_charaname2nickname[charaname].append(nickname)
        return tmp_charaname2nickname
    
    def getCharacterName(self, front_name:str)->CharacterName|None:
        """
        フロントでのキャラ名からHumanインスタンスのキャラ名に変換する関数
        """
        try:
            return self.nickname2Charaname[NickName(name=front_name)]
        except Exception as e:
            print(f"{front_name}は対応するキャラがサーバーに登録されていません。")
            return None

class HumanImagesManager:
    api_dir: Path
    charaFilePathJson_filepath:Path
    human_images: dict[CharacterName, list[HumanImage]]

    def __init__(self):
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        self.charaFilePathJson_filepath = self.api_dir / "CharSettingJson/CharFilePath.json"
        self.human_images = self.loadAllHumanImages()

    
    def loadAllHumanImages(self)->dict[CharacterName, list[HumanImage]]:
        path = self.charaFilePathJson_filepath
        # もしファイルが存在しない場合はファイルを作成
        JsonAccessor.checkExistAndCreateJson(path, {})
        human_images_dict:dict[str, list[str]] = ExtendFunc.loadJsonToDict(path)
        # human_imagesの型が正常かどうかを確認
        for name, human_images in human_images_dict.items():
            if not isinstance(name, str) or not isinstance(human_images, list):
                raise TypeError(f"human_imagesの型が正常ではありません。name:{name}, human_images:{human_images}")
        return {CharacterName(name=name):[HumanImage(folder_name=folder_name) for folder_name in human_images] for name, human_images in human_images_dict.items()}
    
    def tryAddHumanFolder(self, charaNames:list[CharacterName]):
        """
        humanlistを取得してキャラ名 →立ち絵一覧のリストにないキャラがいた場合は
        - ファイルパス一覧に追加する
        - フォルダを生成する
        """
        all_manager = AllHumanInformationManager.singleton()
        charaNameList = all_manager.chara_names_manager.chara_names
        for charaName in charaNames:
            if charaName not in charaNameList:
                if charaName not in self.human_images:
                    #ファイルパス一覧に追加する
                    self.human_images[charaName] = []
        
        #上書き保存する
        self.updateHumanImages(self.human_images)
        #フォルダを生成する
        HumanPart.initalCheck()

    
    def updateHumanImages(self, human_images:dict[CharacterName, list[HumanImage]]):
        """
        人物画像リストを上書きします。部分更新ではないので注意してください。
        """
        path = self.charaFilePathJson_filepath
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

    

class HumanInformation(BaseModel):
    chara_name: CharacterName
    nicknames: list[NickName]
    voice_modes: list[VoiceMode]
    images: list[HumanImage]

    def __init__(self, chara_name:CharacterName):
        ExtendFunc.ExtendPrintWithTitle("名前",chara_name)
        ExtendFunc.ExtendPrint(chara_name)
        ExtendFunc.ExtendPrint("ニックネームロード")
        nicknames = self.loadNicknames(chara_name)
        ExtendFunc.ExtendPrint("ボイスモードロード")
        voice_modes = self.loadVoiceModes(chara_name)
        ExtendFunc.ExtendPrint("イメージロード")
        images = self.loadImages(chara_name)
        super().__init__(chara_name=chara_name, nicknames=nicknames, voice_modes=voice_modes, images=images)

    def loadNicknames(self, chara_name:CharacterName):
        return AllHumanInformationManager.singleton().nick_names_manager.nicknames[chara_name]

    def loadVoiceModes(self, chara_name:CharacterName):
        return AllHumanInformationManager.singleton().CharaNames2VoiceModeDict_manager.chara_names2_voice_modes[chara_name]

    def loadImages(self, chara_name:CharacterName):
        return AllHumanInformationManager.singleton().human_images.human_images[chara_name]

class HumanInformationList(BaseModel):
    tTSSoftware: str#TTSSoftware
    human_informations: list[HumanInformation]

    def __init__(self, tTSSoftware:TTSSoftware):
        mana = AllHumanInformationManager.singleton()
        charaNames = mana.chara_names_manager.chara_names[tTSSoftware]
        super().__init__(tTSSoftware=tTSSoftware.value, human_informations=[HumanInformation(chara_name) for chara_name in charaNames])

class AllHumanInformationDict(BaseModel):
    data: dict[TTSSoftwareType,HumanInformationList]

    def __init__(self):
        data = {software.value:HumanInformationList(software) for software in TTSSoftware}
        super().__init__(data=data)

    def save(self):
        path = AllHumanInformationManager.singleton().api_dir / "CharSettingJson/AllHumanInformation.json"
        JsonAccessor.checkExistAndCreateJson(path, {})
        ExtendFunc.ExtendPrintWithTitle("保存",self.model_dump())
        ExtendFunc.saveDictToJson(path, self.model_dump())

    def load(self):
        path = AllHumanInformationManager.singleton().api_dir / "CharSettingJson/AllHumanInformation.json"
        data = ExtendFunc.loadJsonToDict(path)
        return AllHumanInformationDict(**data)



        

class SelectCharacterState(BaseModel):
    tts_software: TTSSoftwareType
    character_name: CharacterName
    human_image: HumanImage
    voice_mode: VoiceMode

    @staticmethod
    def new(tts_software: TTSSoftwareType, chara_name:CharacterName, nickname:NickName, voice_mode:VoiceMode):
        return SelectCharacterState(tts_software=tts_software, character_name=chara_name, human_image=HumanImage(folder_name=""), voice_mode=voice_mode)
    

class HumanInformationTest:
    def __init__(self):
        self.test2()


    
    def test2(self):
        name = CharacterName(name="test")
        name2 = CharacterName(name="test")
        print(name == name2)