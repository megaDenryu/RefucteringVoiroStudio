import { CharacterId, TTSSoftware } from "../../ValueObject/Character";
import { IVoiceState } from "../../ValueObject/VoiceState";


export interface ICharacterName {
    name: string;
}

export interface INickName {
    name: string;
}

export interface IVoiceMode {
    mode: string;
    id: number|null;
    id_str: string|null;
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

export interface ICharacterModeState {
    id: CharacterId,
    tts_software: TTSSoftware,
    character_name: ICharacterName, 
    human_image: IHumanImage,
    voice_mode: IVoiceMode,
    voice_state: IVoiceState,
    front_name: string

}

export interface ICharacterModeStateReq {
    characterModeState: ICharacterModeState;
    client_id: string;
}