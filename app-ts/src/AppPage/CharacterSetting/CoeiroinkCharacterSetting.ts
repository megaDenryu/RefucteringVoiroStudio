import { BaseComponent } from "../../UiComponent/Base/ui_component_base";
import { ScrollableSquareBoardComponent } from "../../UiComponent/Board/ScrollableSquareComponent";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RequestAPI } from "../../Web/RequestApi";
import { SerifSettingModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/SerifSetting/SerifSettingModel";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { CoeiroinkCharacterSettingSaveModelReq } from "../../ZodObject/DataStore/CharacterSetting/CoeiroinkCharacterSettingSaveModelReq";
import { CoeiroinkVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { CharacterInfoSetting } from "./CharacterInfoSetting/CharacterInfoSetting";
import { ICharacterInfoSetting } from "./CharacterInfoSetting/ICharacterInfoSetting";
import { ICharacterSetting } from "./ICharacterSetting";
import { IReadingAloudSetting } from "./ReadingAloudSetting/IReadingAloudSetting";
import { ReadingAloudSetting } from "./ReadingAloudSetting/ReadingAloudSetting";
import { CoeiroinkVoiceSetting, createCoeiroinkVoiceSetting } from "./VoiceSetting/CoeiroinkVoiceSetting";



export class CoeiroinkCharacterSetting implements ICharacterSetting<CoeiroinkVoiceSettingModel> {
    public readonly component: BaseComponent;
    public readonly title = "キャラクター設定";
    private _squareBoardComponent: ScrollableSquareBoardComponent;
    public voiceSetting: CoeiroinkVoiceSetting;
    public characterInfoSetting: ICharacterInfoSetting;
    public readingAloudSetting: IReadingAloudSetting;
    private _closeButton: NormalButton;
    private readonly req:TtsSoftWareVoiceSettingReq;
    private _characterSaveData: ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>;
    
    public constructor(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>) {
        this._squareBoardComponent = new ScrollableSquareBoardComponent(
            this.title,
            null,"50vh",
            [],
            {},
            null,
            true
        );
        this.req = req;
        this._characterSaveData = characterSaveData;
        this.component = this._squareBoardComponent.component;
        this._closeButton = new NormalButton("閉じる", "warning").addOnClickEvent(this.close.bind(this));
        this.voiceSetting = createCoeiroinkVoiceSetting(req.character_id, characterSaveData.voiceSetting, this);
        this.characterInfoSetting = new CharacterInfoSetting(characterSaveData.characterInfo, this);
        this.readingAloudSetting = new ReadingAloudSetting(characterSaveData.readingAloud, this);
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

    public saveReadingAloud(readingAloud: SerifSettingModel): void {
        this._characterSaveData.readingAloud = readingAloud;
        this.sendSaveData(this._characterSaveData);
    }
    
    private sendSaveData(saveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>): void {
        const saveDataReq:CoeiroinkCharacterSettingSaveModelReq = {
            page_mode: this.req.page_mode,
            client_id: this.req.client_id,
            character_id: this.req.character_id,
            coeiroinkCharacterSettingModel: saveData
        }
        const res = RequestAPI.postRequest("CoeiroinkCharacterSetting", saveDataReq);
    }

    public isOpen(): boolean {
        return this._squareBoardComponent.component.isShow;
    }

    public open(): void {
        this._squareBoardComponent.component.show();
        console.log(this.component.element)
    }

    public close(): void {
        this._squareBoardComponent.component.hide();
    }

    public delete(): void {
        this._squareBoardComponent.component.delete();
        this.voiceSetting.delete();
        this.characterInfoSetting.delete();
        this.readingAloudSetting.delete();
    }

    private initialize() {
        this.voiceSetting.component.setAsChildComponent();
        this.characterInfoSetting.component.setAsChildComponent();
        this.readingAloudSetting.component.setAsChildComponent
        this._squareBoardComponent.addComponentToHeader(this._closeButton);
        this._squareBoardComponent.component.addCSSClass(["positionAbsolute"]);
        this._squareBoardComponent.addComponentToContent(this.voiceSetting);
        this._squareBoardComponent.addComponentToContent(this.readingAloudSetting);
        this._squareBoardComponent.addComponentToContent(this.characterInfoSetting);

        document.body.appendChild(this._squareBoardComponent.component.element);
        // this.onAddedToDom();
        //初期位置をウインドウの真ん中の位置にする
        this._squareBoardComponent.setInitialPosition(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
    }
}

export function createCoeiroinkCharacterSetting(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>): CoeiroinkCharacterSetting {
    return new CoeiroinkCharacterSetting(req, characterSaveData);
}