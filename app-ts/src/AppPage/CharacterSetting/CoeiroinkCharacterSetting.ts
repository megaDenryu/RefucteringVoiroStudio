import { BaseComponent, IHasComponent } from "../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { CharacterId } from "../../ValueObject/Character";
import { RequestAPI } from "../../Web/RequestApi";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { CoeiroinkCharacterSettingSaveModelReq } from "../../ZodObject/DataStore/CharacterSetting/CoeiroinkCharacterSettingSaveModelReq";
import { CoeiroinkVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { CoeiroinkVoiceSettingModelReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModelReq";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { ICharacterSetting } from "./ICharacterSetting";
import { ISaveSetting } from "./ISaveSetting";
import { CoeiroinkVoiceSetting, createCoeiroinkVoiceSetting } from "./VoiceSetting/CoeiroinkVoiceSetting";


export class CoeiroinkCharacterSetting implements ICharacterSetting<CoeiroinkVoiceSettingModel> {
    public readonly component: BaseComponent;
    public readonly title = "キャラクター設定";
    private _squareBoardComponent: SquareBoardComponent;
    private _closeButton: NormalButton;
    public voiceSetting: CoeiroinkVoiceSetting;
    private readonly req:TtsSoftWareVoiceSettingReq;
    private _characterSaveData: ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>;
    
    public constructor(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>) {
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
        this.voiceSetting = createCoeiroinkVoiceSetting(req.character_id, characterSaveData.voiceSetting, this);
        this.initialize();
    }

    public saveVoiceSetting(voiceSetting:CoeiroinkVoiceSettingModel): void {
        this._characterSaveData.voiceSetting = voiceSetting;
        this.sendSaveData(this._characterSaveData);
    }

    public saveCharacterInfo(characterInfo: CharacterInfo): void {
        this._characterSaveData.characterInfo = characterInfo;
        this.sendSaveData(this._characterSaveData);
    }
    private sendSaveData(saveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>): void {
        const saveDataReq:CoeiroinkCharacterSettingSaveModelReq = {
            page_mode: this.req.page_mode,
            client_id: this.req.client_id,
            character_id: this.req.character_id,
            coeiroinkCharacterSettingModel: saveData
        }
        RequestAPI.postRequest("CoeiroinkCharacterSetting", saveDataReq);
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

export function createCoeiroinkCharacterSetting(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>): CoeiroinkCharacterSetting {
    return new CoeiroinkCharacterSetting(req, characterSaveData);
}