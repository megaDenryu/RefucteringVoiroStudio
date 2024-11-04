import { ICharacterModeState } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";
import { CharacterId } from "./Character";

interface MessageUnit {
    text: string;
    characterModeState: ICharacterModeState|null;

}

export type MessageDict = Record<CharacterId, MessageUnit>;

export interface SendData {
    message: MessageDict;
    gpt_mode: Record<string, string>;
}