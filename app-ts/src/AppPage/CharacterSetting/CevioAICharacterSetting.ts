import { BaseComponent } from "../../UiComponent/Base/ui_component_base";
import { ScrollableSquareBoardComponent } from "../../UiComponent/Board/ScrollableSquareComponent";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { ICharacterSettingSaveModel } from "../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RequestAPI } from "../../Web/RequestApi";
import { CevioAICharacterSettingSaveModelReq } from "../../ZodObject/DataStore/CharacterSetting/CevioAICharacterSettingSaveModelReq";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { CharacterInfoSetting } from "./CharacterInfoSetting/CharacterInfoSetting";
import { ICharacterInfoSetting } from "./CharacterInfoSetting/ICharacterInfoSetting";
import { ICharacterSetting } from "./ICharacterSetting";
import { CevioAIVoiceSetting, createCevioAIVoiceSetting } from "./VoiceSetting/CevioAIVoiceSetting";



export class CevioAICharacterSetting implements ICharacterSetting<CevioAIVoiceSettingModel> {
    public readonly component: BaseComponent;
        public readonly title = "キャラクター設定";
        private _squareBoardComponent: ScrollableSquareBoardComponent;
        private _closeButton: NormalButton;
        public voiceSetting: CevioAIVoiceSetting;
        public characterInfoSetting: ICharacterInfoSetting;
        private readonly req:TtsSoftWareVoiceSettingReq;
        private _characterSaveData: ICharacterSettingSaveModel<CevioAIVoiceSettingModel>;
        
        public constructor(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CevioAIVoiceSettingModel>) {
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
            this._closeButton = new NormalButton("閉じる", "warning").addOnClickEvent(() => {this.close()});
            this.voiceSetting = createCevioAIVoiceSetting(req.character_id, characterSaveData, this);
            this.characterInfoSetting = new CharacterInfoSetting(characterSaveData.characterInfo, this);
            this.initialize();
        }
    
        public saveVoiceSetting(voiceSetting:CevioAIVoiceSettingModel): void {
            this._characterSaveData.voiceSetting = voiceSetting;
            this.sendSaveData(this._characterSaveData);
        }
    
        public saveCharacterInfo(characterInfo: CharacterInfo): void {
            this._characterSaveData.characterInfo = characterInfo;
            this.sendSaveData(this._characterSaveData);
        }
        private sendSaveData(saveData:ICharacterSettingSaveModel<CevioAIVoiceSettingModel>): void {
            const saveDataReq:CevioAICharacterSettingSaveModelReq = {
                page_mode: this.req.page_mode,
                client_id: this.req.client_id,
                character_id: this.req.character_id,
                cevioAICharacterSettingModel: saveData
            }
            RequestAPI.postRequest("CevioAICharacterSetting", saveDataReq);
        }
    
        public isOpen(): boolean {
            return this._squareBoardComponent.component.isShow;
        }
    
        public open(): void {
            this._squareBoardComponent.component.show();
        }
    
        public close(): void {
            this._squareBoardComponent.component.hide();
        }
    
        public delete(): void {
            this._squareBoardComponent.component.delete();
            this.voiceSetting.delete();
            this.characterInfoSetting.delete();
        }
    
        private initialize() {
            this.voiceSetting.component.setAsChildComponent();
            this.characterInfoSetting.component.setAsChildComponent();
            this._squareBoardComponent.addComponentToHeader(this._closeButton);
            this.component.setAsParentComponent();
            this._squareBoardComponent.addComponentToContent(this.voiceSetting);
            this._squareBoardComponent.addComponentToContent(this.characterInfoSetting);

    
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
            this.characterInfoSetting.onAddedToDom();
        }
    }
    
    export function createCevioAICharacterSetting(req:TtsSoftWareVoiceSettingReq, characterSaveData:ICharacterSettingSaveModel<CevioAIVoiceSettingModel>): CevioAICharacterSetting {
        return new CevioAICharacterSetting(req, characterSaveData);
    }