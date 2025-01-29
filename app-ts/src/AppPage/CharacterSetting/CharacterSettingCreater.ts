import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { TTSSoftware } from "../../ValueObject/Character";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { CoeiroinkVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { VoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceSettingModel";
import { VoiceVoxVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModel";
import { createCoeiroinkCharacterSetting } from "./CoeiroinkCharacterSetting";
import { ICharacterSetting } from "./ICharacterSetting";
import { createCevioAIVoiceSetting } from "./VoiceSetting/CevioAIVoiceSetting";
import { createVoiceVoxVoiceSetting } from "./VoiceSetting/VoiceVoxVoiceSetting";

export function createCharacterVoiceSetting(req:TtsSoftWareVoiceSettingReq, ttsSoftWare: TTSSoftware, characterSaveData:ICharacterSettingSaveModel<VoiceSettingModel>): ICharacterSetting<VoiceSettingModel>|null {
    if (ttsSoftWare === "CevioAI") {
        return createCevioAIVoiceSetting(req.character_id, characterSaveData as ICharacterSettingSaveModel<CevioAIVoiceSettingModel>);
    } 
    else if (ttsSoftWare === "VoiceVox") {
        return createVoiceVoxVoiceSetting(req.character_id, characterSaveData as ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>);
    }
    else if (ttsSoftWare === "Coeiroink") {
        return createCoeiroinkCharacterSetting(req, characterSaveData as ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>);
    }
    return null;
}