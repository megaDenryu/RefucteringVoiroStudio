import { TTSSoftware } from "../../ValueObject/Character";


export interface ICharacterName {
    name: string;
}

export interface INickName {
    name: string;
}

export interface IVoiceMode {
    mode: string;
    id?: number;
    id_str?: string;
}

export interface IHumanImage {
    folder_name: string;
}

export interface IHumanInformation {
    chara_name: ICharacterName;
    nicknames: INickName[];
    voice_modes: IVoiceMode[];
    images: IHumanImage[];
}

export interface IHumanInformationList {
    tTSSoftware: TTSSoftware;
    human_informations: IHumanInformation[];
}

export interface IAllHumanInformationDict {
    data: Record<TTSSoftware, IHumanInformationList>;
}