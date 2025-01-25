import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { TTSSoftware } from "../../ValueObject/Character";
import { createCevioAIVoiceSetting } from "./VoiceSetting/CevioAIVoiceSetting";
import { createCoeiroinkVoiceSetting } from "./VoiceSetting/CoeiroinkVoiceSetting";
import { IVoiceSetting } from "./VoiceSetting/IVoiceSetting";
import { createVoiceVoxVoiceSetting } from "./VoiceSetting/VoiceVoxVoiceSetting";

export function createCharacterVoiceSetting(character_id: string, ttsSoftWare: TTSSoftware): IVoiceSetting|null {
    if (ttsSoftWare === "CevioAI") {
        return createCevioAIVoiceSetting(character_id);
    } 
    else if (ttsSoftWare === "VoiceVox") {
        return createVoiceVoxVoiceSetting(character_id);
    }
    else if (ttsSoftWare === "Coeiroink") {
        return createCoeiroinkVoiceSetting(character_id);
    }
    return null;
}