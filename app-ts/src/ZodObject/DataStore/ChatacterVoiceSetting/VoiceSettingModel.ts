import { VoiceVoxVoiceSetting } from "../../../AppPage/CharacterSetting/VoiceSetting/VoiceVoxVoiceSetting";
import { AIVoiceVoiceSettingModel } from "./AIVoiceVoiceSetting/AIVoiceVoiceSettingModel";
import { CevioAIVoiceSettingModel } from "./CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { CoeiroinkVoiceSettingModel } from "./CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";

export type VoiceSettingModel = CevioAIVoiceSettingModel|AIVoiceVoiceSettingModel|VoiceVoxVoiceSetting|CoeiroinkVoiceSettingModel;