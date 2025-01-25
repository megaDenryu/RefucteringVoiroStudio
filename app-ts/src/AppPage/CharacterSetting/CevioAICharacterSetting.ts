import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { RequestAPI } from "../../Web/RequestApi";
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
        // saveIDを元にCevioAICharacterSettingSaveModelのデータを取得
        const req = {
            saveID: saveID
        }
        this.initialize(req);
        
    }

    private async initialize(req: { saveID: string }) {
        this.manageData = await RequestAPI.postRequest<CevioAICharacterSettingSaveModel>("CevioAICharacterSetting", req);
    }
}



export function createCevioAICharacterSetting(saveID: string): CevioAICharacterSetting {
    return new CevioAICharacterSetting(saveID);
}