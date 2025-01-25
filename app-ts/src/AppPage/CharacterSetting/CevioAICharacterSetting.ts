import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { CevioAICharacterSettingSaveModel } from "../../ZodObject/DataStore/CharacterSetting/CevioAICharacterSettingSaveModel";
import { CevioAIVoiceSetting } from "./VoiceSetting/CevioAIVoiceSetting";


export class CevioAICharacterSetting {
    private testMode: boolean = false;
    public readonly title = "キャラクター設定";
    public manageData: CevioAICharacterSettingSaveModel;

    private _squareBoardComponent: SquareBoardComponent;
    private _closeButton: NormalButton;
    private voiceSetting: CevioAIVoiceSetting

    constructor(saveID: string) {
        
    }
}