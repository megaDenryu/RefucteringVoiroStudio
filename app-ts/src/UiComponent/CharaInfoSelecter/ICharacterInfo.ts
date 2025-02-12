import { CharacterId, CharacterSaveId, TTSSoftware } from "../../ValueObject/Character";
import { IVoiceState } from "../../ValueObject/VoiceState";
import { AIVoiceCharacterSettingSaveModel } from "../../ZodObject/DataStore/CharacterSetting/AIVoiceCharacterSettingSaveModel";
import { CevioAICharacterSettingSaveModel } from "../../ZodObject/DataStore/CharacterSetting/CevioAICharacterSettingSaveModel";
import { CoeiroinkCharacterSettingSaveModel } from "../../ZodObject/DataStore/CharacterSetting/CoeiroinkCharacterSettingSaveModel";
import { VoiceVoxCharacterSettingSaveModel } from "../../ZodObject/DataStore/CharacterSetting/VoiceVoxCharacterSettingSaveModel";


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

export interface ICevioAICharacterSettingCollection {
    collection: CevioAICharacterSettingSaveModel[]
}

export interface IVoiceVoxCharacterSettingCollection {
    collection: VoiceVoxCharacterSettingSaveModel[]
}

export interface ICoeiroinkCharacterSettingCollection {
    collection: CoeiroinkCharacterSettingSaveModel[]
}

export interface IAIVoiceCharacterSettingCollection {
    collection: AIVoiceCharacterSettingSaveModel[]
}

export interface ICharacterSettingSaveDatas {
    characterSettingCevioAI: ICevioAICharacterSettingCollection
    characterSettingVoiceVox: IVoiceVoxCharacterSettingCollection
    characterSettingCoeiroink: ICoeiroinkCharacterSettingCollection
    characterSettingAIVoice: IAIVoiceCharacterSettingCollection
}

export interface IAllHumanInformationDict {
    data: Record<TTSSoftware, IHumanInformationList>;
    characterSettingSaveDatas: ICharacterSettingSaveDatas
}

export interface ICharacterModeState {
    id: CharacterId,
    save_id: CharacterSaveId,
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