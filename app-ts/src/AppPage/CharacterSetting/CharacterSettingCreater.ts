import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { TTSSoftware } from "../../ValueObject/Character";
import { AIVoiceVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/AIVoiceVoiceSetting/AIVoiceVoiceSettingModel";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { CoeiroinkVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { VoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceSettingModel";
import { VoiceVoxVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModel";
import { createAIVoiceCharacterSetting } from "./AIVoiceCharacterSetting";
import { createCevioAICharacterSetting } from "./CevioAICharacterSetting";
import { createCoeiroinkCharacterSetting } from "./CoeiroinkCharacterSetting";
import { ICharacterSetting } from "./ICharacterSetting";
import { createVoiceVoxCharacterSetting } from "./VoiceVoxCharacterSetting";

export function createCharacterVoiceSetting(req:TtsSoftWareVoiceSettingReq, ttsSoftWare: TTSSoftware, characterSaveData:ICharacterSettingSaveModel<VoiceSettingModel>): ICharacterSetting<VoiceSettingModel>|null {
    if (ttsSoftWare === "CevioAI") {
        return createCevioAICharacterSetting(req, characterSaveData as ICharacterSettingSaveModel<CevioAIVoiceSettingModel>);
    } 
    else if (ttsSoftWare === "VoiceVox") {
        return createVoiceVoxCharacterSetting(req, characterSaveData as ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>);
    }
    else if (ttsSoftWare === "Coeiroink") {
        return createCoeiroinkCharacterSetting(req, characterSaveData as ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>);
    }
    else if (ttsSoftWare == "AIVoice") {
        return createAIVoiceCharacterSetting(req, characterSaveData as ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>);
    }
    return null;
}