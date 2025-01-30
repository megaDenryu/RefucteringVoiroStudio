import { BaseComponent } from "../../UiComponent/Base/ui_component_base";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RequestAPI } from "../../Web/RequestApi";
import { AIVoiceCharacterSettingSaveModelReq } from "../../ZodObject/DataStore/CharacterSetting/AIVoiceCharacterSettingSaveModelReq";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { AIVoiceVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/AIVoiceVoiceSetting/AIVoiceVoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { ICharacterSetting } from "./ICharacterSetting";
import { AIVoiceVoiceSetting, createAIVoiceVoiceSetting } from "./VoiceSetting/AIVoiceVoiceSetting";

export class AIVoiceCharacterSetting implements ICharacterSetting<AIVoiceVoiceSettingModel> {
    public readonly component: BaseComponent;
    public readonly title = "キャラクター設定";
    private _squareBoardComponent: SquareBoardComponent;
    private _closeButton: NormalButton;
    public voiceSetting: AIVoiceVoiceSetting;
    private readonly req:TtsSoftWareVoiceSettingReq;
    private _characterSaveData: ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>;
    
    public constructor(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>) {
        this._squareBoardComponent = new SquareBoardComponent(
            this.title,
            null,
            null,
            [],
            {},
            null,
            true
        );
        this.req = req;
        this._characterSaveData = characterSaveData;
        this.component = this._squareBoardComponent.component;
        this._closeButton = new NormalButton("閉じる", "warning");
        this.voiceSetting = createAIVoiceVoiceSetting(req.character_id, characterSaveData.voiceSetting, this);
        this.initialize();
    }

    public saveVoiceSetting(voiceSetting:AIVoiceVoiceSettingModel): void {
        this._characterSaveData.voiceSetting = voiceSetting;
        this.sendSaveData(this._characterSaveData);
    }

    public saveCharacterInfo(characterInfo: CharacterInfo): void {
        this._characterSaveData.characterInfo = characterInfo;
        this.sendSaveData(this._characterSaveData);
    }
    private sendSaveData(saveData:ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>): void {
        const saveDataReq:AIVoiceCharacterSettingSaveModelReq = {
            page_mode: this.req.page_mode,
            client_id: this.req.client_id,
            character_id: this.req.character_id,
            aiVoiceCharacterSettingSaveModel: saveData
        }
        RequestAPI.postRequest("AIVoiceCharacterSetting", saveDataReq);
    }

    public isOpen(): boolean {
        return this._squareBoardComponent.component.isShow;
    }

    public open(): void {
        console.log("open");
        this._squareBoardComponent.component.show();
        this.voiceSetting.open();
        console.log(this.component.element)
    }

    public close(): void {
        this._squareBoardComponent.component.hide();
        this.voiceSetting.close();
    }

    public delete(): void {
        this._squareBoardComponent.component.delete();
        this.voiceSetting.component.delete();
    }

    private initialize() {
        this.voiceSetting.component.addCSSClass(["positionRelative"]);
        this.voiceSetting.component.removeCSSClass(["positionAbsolute"]);
        this._squareBoardComponent.addComponentToHeader(this._closeButton);
        this._squareBoardComponent.component.addCSSClass(["positionAbsolute"]);
        this.component.createArrowBetweenComponents(this, this.voiceSetting);

        document.body.appendChild(this._squareBoardComponent.component.element);
        this.onAddedToDom();
        //初期位置をウインドウの真ん中の位置にする
        this._squareBoardComponent.setInitialPosition(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
    }

    public onAddedToDom() {
        this.voiceSetting.onAddedToDom();
    }
}

export function createAIVoiceCharacterSetting(
    req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>
): AIVoiceCharacterSetting {
    return new AIVoiceCharacterSetting(req, characterSaveData);
}