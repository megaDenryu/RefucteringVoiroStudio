import { ISelectCharacterState } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";
import { CharacterId, CharacterName, SelectCharacterState } from "./Character";

interface MessageUnit {
    text: string;
    selectCharacterState: ISelectCharacterState|null;

}

export type MessageDict = Record<CharacterId, MessageUnit>;

export interface SendData {
    message: MessageDict;
    gpt_mode: Record<string, string>;
}