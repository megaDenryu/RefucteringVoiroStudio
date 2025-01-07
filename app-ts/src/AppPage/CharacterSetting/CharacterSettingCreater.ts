import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { TTSSoftware } from "../../ValueObject/Character";
import { createCevioAIVoiceSetting } from "./CevioAIVoiceSetting";
import { createVoiceVoxVoiceSetting } from "./VoiceVoxVoiceSetting";

export function createCharacterVoiceSetting(character_id: string, ttsSoftWare: TTSSoftware): IOpenCloseWindow|null {
    if (ttsSoftWare === "CevioAI") {
        return createCevioAIVoiceSetting(character_id);
    } 
    else if (ttsSoftWare === "VoiceVox") {
        return createVoiceVoxVoiceSetting(character_id);
    }
    return null;
}