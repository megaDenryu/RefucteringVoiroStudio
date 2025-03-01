import { SerifSettingModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/SerifSetting/SerifSettingModel";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { VoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceSettingModel";

export interface ISaveVoiceSetting <T extends VoiceSettingModel> {
    saveVoiceSetting(voiceSetting:T): void
}

export interface ISaveCharacterInfo {
    saveCharacterInfo(characterInfo: CharacterInfo): void
}

export interface ISaveReadingAloud {
    saveReadingAloud(readingAloud: SerifSettingModel): void
}

export interface ISaveSetting <T extends VoiceSettingModel> extends ISaveVoiceSetting<T>, ISaveCharacterInfo, ISaveReadingAloud {
}