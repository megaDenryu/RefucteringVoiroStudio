import { ICharacterModeState } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";
import { CharacterId, CharacterName, CharacterModeState } from "./Character";

interface MessageUnit {
    text: string;
    selectCharacterState: ICharacterModeState|null;

}

export type MessageDict = Record<CharacterId, MessageUnit>;

export interface SendData {
    message: MessageDict;
    gpt_mode: Record<string, string>;
}