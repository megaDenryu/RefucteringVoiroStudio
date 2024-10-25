from typing import Literal, TypedDict, TypeAlias

BodyUnitKey: TypeAlias = str #足、腕、胴、頭、口など
BodyUnitVariationKey: TypeAlias = str #口(笑顔)、口(驚き)など
BodyUnitVariationOnOff: TypeAlias = Literal["on", "off"] #口(笑顔)がonかoffか
BodyUnitValue: TypeAlias = dict[BodyUnitVariationKey, BodyUnitVariationOnOff]
InitBodyInfo: TypeAlias = dict[BodyUnitKey, BodyUnitValue]


BodyUnitVariationFileKey: TypeAlias = str #"130_ほほえみ.json"または130_ほほえみ.pngなど
BodyUnitVariationFileType: TypeAlias = Literal["json", "gazou"] #130_ほほえみ.json"または130_ほほえみ.pngなどがjsonかgazouか
BodyUnitAllFileTypeInfo: TypeAlias = dict[BodyUnitVariationFileKey, BodyUnitVariationFileType]
AllBodyFileInfo: TypeAlias = dict[BodyUnitKey, BodyUnitAllFileTypeInfo]


class InitImageInfo(TypedDict):
    init: InitBodyInfo
    all_data: AllBodyFileInfo