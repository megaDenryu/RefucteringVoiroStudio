import { IHasComponent } from "../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { VoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceSettingModel";
import { ICharacterInfoSetting } from "./CharacterInfoSetting/ICharacterInfoSetting";
import { ISaveSetting } from "./ISaveSetting";
import { IVoiceSetting } from "./VoiceSetting/IVoiceSetting";

export interface ICharacterSetting<T extends VoiceSettingModel> extends IOpenCloseWindow, IHasComponent, ISaveSetting<T>{
    voiceSetting: IVoiceSetting;
    characterInfoSetting: ICharacterInfoSetting;
}