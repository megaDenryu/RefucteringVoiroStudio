from typing import Literal, TypedDict, TypeAlias

# from api.gptAI.HumanInformation import CharacterModeState

BodyUnitKey: TypeAlias = str #足、腕、胴、頭、口に順番識別用番号などが付いたもの。例：3_30_耳　4_40_腕など
BodyUnitVariationKey: TypeAlias = str #口(笑顔)、口(驚き)など,"130_ほほえみ"　など
BodyUnitVariationOnOff: TypeAlias = Literal["on", "off"] #口(笑顔)がonかoffか
BodyUnitValue: TypeAlias = dict[BodyUnitVariationKey, BodyUnitVariationOnOff]
PoseInfo: TypeAlias = dict[BodyUnitKey, BodyUnitValue]


BodyUnitVariationFileKey: TypeAlias = str #"30_ﾌﾞﾝﾌﾞﾝ.json"または30_ﾌﾞﾝﾌﾞﾝ.pngなど。ImageNameの先頭の数字を10倍にしたものがこの文字列の先頭の数字になっている。もう使ってないかもしれない
BodyUnitVariationFileType: TypeAlias = Literal["json", "gazou"] #30_ﾌﾞﾝﾌﾞﾝ.json"または30_ﾌﾞﾝﾌﾞﾝ.pngなどがjsonかgazouか
BodyUnitAllFileTypeInfo: TypeAlias = dict[BodyUnitVariationFileKey, BodyUnitVariationFileType]
AllBodyFileInfo: TypeAlias = dict[BodyUnitKey, BodyUnitAllFileTypeInfo]

class BodyFolderFileName(TypedDict):
    folder_name: str
    file_name: str

class PakuStateSpecies(TypedDict):
    開候補: list[BodyFolderFileName]
    閉: list[BodyFolderFileName]

class OnomatopeiaActionSetting(TypedDict):
    パク:PakuStateSpecies
    パチ:PakuStateSpecies
    ぴょこ:PakuStateSpecies

class NowOnomatopoeiaActionSetting(TypedDict):
    パク:list[BodyFolderFileName]
    パチ:list[BodyFolderFileName]
    ぴょこ:list[BodyFolderFileName]

class HumanDataSetting(TypedDict):
    lip_sync: Literal['パクパク']

class InitImageInfo(TypedDict):
    init: PoseInfo
    all_data: AllBodyFileInfo
    OnomatopeiaActionSetting:OnomatopeiaActionSetting
    NowOnomatopoeiaActionSetting:NowOnomatopoeiaActionSetting
    setting: HumanDataSetting|None

ImageBinary: TypeAlias = bytes #画像のバイナリデータ。strかもしれないが要検証
ImageName: TypeAlias = str #画像のファイル名。"3_ﾌﾞﾝﾌﾞﾝ.png"など
class ImageInfo (TypedDict):
    name: ImageName
    x: int
    y: int
    width: int
    height: int
    z_index: int
    initial_display: bool

class BodyUnitVariationImageInfo (TypedDict):
    img: ImageBinary
    json: ImageInfo

BodyUnitVariationImages: TypeAlias = dict[BodyUnitVariationKey, BodyUnitVariationImageInfo]
BodyPartsImages: TypeAlias = dict[BodyUnitKey, BodyUnitVariationImages]

class HumanData(TypedDict):
    body_parts_iamges: BodyPartsImages
    init_image_info: InitImageInfo
    front_name: str
    char_name: str


