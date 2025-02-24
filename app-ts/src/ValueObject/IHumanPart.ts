import { ExtendedMap } from "../Extend/extend_collections";
import { ICharacterModeState } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";

export type BodyUnitKey = string; // 足、腕、胴、頭、口に順番識別用番号などが付いたもの。例：3_30_耳　4_40_腕など
export type BodyUnitVariationKey = string; // 口(笑顔)、口(驚き)など,"130_ほほえみ"　など
export type BodyUnitVariationOnOff = "on" | "off"; // 口(笑顔)がonかoffか
export type BodyUnitValue = Record<BodyUnitVariationKey, BodyUnitVariationOnOff>;
export type PoseInfoKey = string; // "init"、"ぐるぐる目"、"水着"など
export type PoseInfo = Record<BodyUnitKey, BodyUnitValue>;
export type PoseInfoMap = ExtendedMap<BodyUnitKey, BodyUnitValue>;

export type BodyUnitVariationFileKey = string; // "30_ﾌﾞﾝﾌﾞﾝ.json"または30_ﾌﾞﾝﾌﾞﾝ.pngなど。ImageNameの先頭の数字を10倍にしたものがこの文字列の先頭の数字になっている。もう使ってないかもしれない
export type BodyUnitVariationFileType = "json" | "gazou"; // "30_ﾌﾞﾝﾌﾞﾝ.json"または30_ﾌﾞﾝﾌﾞﾝ.pngなどがjsonかgazouか
export type BodyUnitAllFileTypeInfo = Record<BodyUnitVariationFileKey, BodyUnitVariationFileType>;
export type AllBodyFileInfo = Record<BodyUnitKey, BodyUnitAllFileTypeInfo>;

export interface BodyFolderFileName {
    folder_name: string;
    file_name: string;
}

export interface PakuStateSpecies {
    開候補: BodyFolderFileName[];
    閉: BodyFolderFileName[];
}

export interface OnomatopeiaActionSetting {
    パク: PakuStateSpecies;
    パチ: PakuStateSpecies;
    ぴょこ: PakuStateSpecies;
}

export interface NowOnomatopoeiaActionSetting {
    パク: BodyFolderFileName[];
    パチ: BodyFolderFileName[];
    ぴょこ: BodyFolderFileName[];
}

export interface HumanDataSetting {
    lip_sync: "パクパク"
}

export interface InitImageInfo {
    init: PoseInfo;
    all_data: AllBodyFileInfo;
    OnomatopeiaActionSetting:OnomatopeiaActionSetting;
    NowOnomatopoeiaActionSetting:NowOnomatopoeiaActionSetting;
    setting: HumanDataSetting|null;
}

export type ImageBinary = Uint8Array; // 画像のバイナリデータ。strかもしれないが要検証
export type ImageName = string; // 画像のファイル名。"3_ﾌﾞﾝﾌﾞﾝ.png"など

export interface ImageInfo {
    name: ImageName;
    x: number;
    y: number;
    width: number;
    height: number;
    z_index: number;
    initial_display: boolean;
}

export interface BodyUnitVariationImageInfo {
    img: ImageBinary;
    json: ImageInfo;
}

export type BodyUnitVariationImages = Record<BodyUnitVariationKey, BodyUnitVariationImageInfo>;
export type BodyUnitVariationImagesMap = ExtendedMap<BodyUnitVariationKey, BodyUnitVariationImageInfo>;

export function convertBodyUnitVariationImagesToMap(bodyUnitVariationImages: BodyUnitVariationImages): BodyUnitVariationImagesMap {
    return new ExtendedMap(Object.entries(bodyUnitVariationImages).sort(
        (a, b) => {
            const keyA = parseInt(a[0].split('_')[0]);
            const keyB = parseInt(b[0].split('_')[0]);
            console.log(keyA, keyB);
            return keyA - keyB;
        }
    ));
}

export type BodyPartsImages = Record<BodyUnitKey, BodyUnitVariationImages>;

export interface HumanData {
    body_parts_iamges: BodyPartsImages;
    init_image_info: InitImageInfo;
    front_name: string;
    char_name: string;
}

export interface CharaCreateData{
    humanData: HumanData;
    characterModeState: ICharacterModeState;
}

export interface CharaCreateDataResponse {
    succese_mode: "成功" | "名前が無効" | "名前を指定してください";
    message: string;
    charaCreateData: CharaCreateData|null;
}

export interface HumanBodyCanvasCssStylePosAndSize {
    height: string; 
    top: string; 
    left: string;
}