import { ICharacterModeState } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";
import { CharacterId } from "./Character";

interface MessageUnit {
    text: string;
    characterModeState: ICharacterModeState|null;

}

export interface SendData {
    messages: MessageUnit[];
}

