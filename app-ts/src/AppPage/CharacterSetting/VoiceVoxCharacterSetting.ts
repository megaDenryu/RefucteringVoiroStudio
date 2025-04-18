import { BaseComponent } from "../../UiComponent/Base/ui_component_base";
import { ScrollableSquareBoardComponent } from "../../UiComponent/Board/ScrollableSquareComponent";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RequestAPI } from "../../Web/RequestApi";
import { SerifSettingModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/SerifSetting/SerifSettingModel";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { VoiceVoxCharacterSettingSaveModelReq } from "../../ZodObject/DataStore/CharacterSetting/VoiceVoxCharacterSettingSaveModelReq";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { VoiceVoxVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModel";
import { CharacterInfoSetting } from "./CharacterInfoSetting/CharacterInfoSetting";
import { ICharacterInfoSetting } from "./CharacterInfoSetting/ICharacterInfoSetting";
import { ICharacterSetting } from "./ICharacterSetting";
import { IReadingAloudSetting } from "./ReadingAloudSetting/IReadingAloudSetting";
import { ReadingAloudSetting } from "./ReadingAloudSetting/ReadingAloudSetting";
import { VoiceVoxVoiceSetting, createVoiceVoxVoiceSetting } from "./VoiceSetting/VoiceVoxVoiceSetting";


export class VoiceVoxCharacterSetting implements ICharacterSetting<VoiceVoxVoiceSettingModel> {
    public readonly component: BaseComponent;
    public readonly title = "キャラクター設定";
    private _squareBoardComponent: ScrollableSquareBoardComponent;
    private _closeButton: NormalButton;
    public voiceSetting: VoiceVoxVoiceSetting;
    public characterInfoSetting: ICharacterInfoSetting;
    public readingAloudSetting: IReadingAloudSetting;
    private readonly req:TtsSoftWareVoiceSettingReq;
    private _characterSaveData: ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>;
    
    public constructor(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>) {
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
        this.voiceSetting = createVoiceVoxVoiceSetting(req.character_id, characterSaveData, this);
        this.characterInfoSetting = new CharacterInfoSetting(characterSaveData.characterInfo, this);
        this.readingAloudSetting = new ReadingAloudSetting(characterSaveData.readingAloud, this);
        this.initialize();
    }

    public saveVoiceSetting(voiceSetting:VoiceVoxVoiceSettingModel): void {
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
    
    private sendSaveData(saveData:ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>): void {
        const saveDataReq:VoiceVoxCharacterSettingSaveModelReq = {
            page_mode: this.req.page_mode,
            client_id: this.req.client_id,
            character_id: this.req.character_id,
            voiceVoxCharacterSettingModel: saveData
        }
        RequestAPI.postRequest("VoiceVoxCharacterSetting", saveDataReq);
    }

    public isOpen(): boolean {
        return this._squareBoardComponent.component.isShow;
    }

    public open(): void {
        this._squareBoardComponent.component.show();
    }

    public close(): void {
        console.log("close");
        this._squareBoardComponent.component.hide();
    }

    public delete(): void {
        this._squareBoardComponent.component.delete();
        this.voiceSetting.component.delete();
        this.characterInfoSetting.delete();
        this.readingAloudSetting.delete();
    }

    private initialize() {
        this.voiceSetting.component.setAsChildComponent();
        this.characterInfoSetting.component.setAsChildComponent();
        this.readingAloudSetting.component.setAsChildComponent();
        this._squareBoardComponent.addComponentToHeader(this._closeButton);
        this.component.setAsParentComponent();
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

export function createVoiceVoxCharacterSetting(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>): VoiceVoxCharacterSetting {
    return new VoiceVoxCharacterSetting(req, characterSaveData);
}