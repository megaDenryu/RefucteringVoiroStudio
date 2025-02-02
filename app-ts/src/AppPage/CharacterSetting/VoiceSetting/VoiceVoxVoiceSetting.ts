import { generateDefaultObject } from "../../../Extend/ZodExtend/ZodExtend";
import { BaseComponent, IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { ToggleButton, OpenCloseState, createOpenCloseButton } from "../../../UiComponent/Button/ToggleButton.ts/ToggleButton";
import { ICharacterSettingSaveModel } from "../../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponent } from "../../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { RequestAPI } from "../../../Web/RequestApi";
import { TtsSoftWareVoiceSettingReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { VoiceVoxVoiceSettingModel } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModel";
import { VoiceVoxVoiceSettingModelFormat } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModelFormat";
import { VoiceVoxVoiceSettingModelReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModelReq";
import { ISaveSetting } from "../ISaveSetting";
import { IVoiceSetting } from "./IVoiceSetting";



export class VoiceVoxVoiceSetting implements IComponentManager, IVoiceSetting, IHasComponent {
  public readonly component: BaseComponent;
  private testMode: boolean = false;
  public readonly title = "全体設定";
  public manageData: VoiceVoxVoiceSettingModel;
  private settingSaver:ISaveSetting<VoiceVoxVoiceSettingModel>;
  private _squareBoardComponent: SquareBoardComponent;
  private _manageDataSettingComponent: ObjectInputComponent<VoiceVoxVoiceSettingModel>;
  private _開閉Button: ToggleButton<OpenCloseState>;
  private _reqInfo: TtsSoftWareVoiceSettingReq;

  public get 読み上げ間隔() {
    return this.manageData.読み上げ間隔;
  }

  /**
   * @param SchemaType スキーマーの型
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  public constructor(req: TtsSoftWareVoiceSettingReq, voiceSetting:VoiceVoxVoiceSettingModel|undefined, settingSaver:ISaveSetting<VoiceVoxVoiceSettingModel>) {
    this._squareBoardComponent = new SquareBoardComponent(
      "設定画面",
      null,
      null,
      [],
      {},
      null,
      true
    );
    this.component = this._squareBoardComponent.component;
    this._開閉Button = createOpenCloseButton({"title":"開閉ボタン","openAction":()=>{this.open()}, "closeAction":()=>{this.close()}, "defaultState":"goClose"});
    this.manageData = voiceSetting ?? generateDefaultObject(VoiceVoxVoiceSettingModel);
    this.settingSaver = settingSaver;
    this.initialize(req);
  }

  /**
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  private async initialize(req: {}) {
    this._manageDataSettingComponent = new ObjectInputComponent(
      this.title,
      VoiceVoxVoiceSettingModel,
      this.manageData,
      null,
      this, VoiceVoxVoiceSettingModelFormat
    );
    this._manageDataSettingComponent.component.addCSSClass("positionRelative");
    this._manageDataSettingComponent.component.removeCSSClass(
      "positionAbsolute"
    );
    this._squareBoardComponent.addComponentToHeader(this._開閉Button);
    this._squareBoardComponent.component.addCSSClass(["positionAbsolute"]);
    this._squareBoardComponent.component.createArrowBetweenComponents(
      this._squareBoardComponent,
      this._manageDataSettingComponent
    );
    this.bindEvents();
  }

  public onAddedToDom() {
    this._manageDataSettingComponent.onAddedToDom();
  }

  private bindEvents() {
    //セーブをオブジェクトインプットコンポーネントに,dartyになったときにセーブを実行するように登録
    this._manageDataSettingComponent.addOnDartyEvent(() => {
      this._manageDataSettingComponent.save();
      this.saveAllSettings();
    });
  }

  private saveAllSettings() {
    // セーブデータの状態を更新する
    const updatedSettings = this._manageDataSettingComponent.getValue();
    this.manageData = updatedSettings;
    // セーブデータを送信する
    this.sendSettings(updatedSettings);
  }

  private sendSettings(settings: VoiceVoxVoiceSettingModel) {
    this.settingSaver.saveVoiceSetting(settings);
  }

  public オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void {
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(
      this,
      recordPath,
      value
    );
    this.sendSettings(this.manageData);
  }

  public オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath: RecordPath): void {
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(
      this,
      recordPath
    );
    this.sendSettings(this.manageData);
  }

  public isOpen(): boolean {
    return this._squareBoardComponent.component.isShow;
  }

  private open(): void {
    this._manageDataSettingComponent.component.show();
  }

  private close(): void {
    this._manageDataSettingComponent.component.hide();
  }

  public delete(): void {
    this._squareBoardComponent.component.delete();
  }
}

export function createVoiceVoxVoiceSetting(
  character_id: string, characterSaveData:ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>, settingSaver:ISaveSetting<VoiceVoxVoiceSettingModel>
): VoiceVoxVoiceSetting {
  const ttsSoftWareVoiceSettingReq: TtsSoftWareVoiceSettingReq = {
    page_mode: "App",
    client_id: "test",
    character_id: character_id,   
  };

  const voiceVoxVoiceSetting = new VoiceVoxVoiceSetting(ttsSoftWareVoiceSettingReq, characterSaveData.voiceSetting, settingSaver);  
  return voiceVoxVoiceSetting;
}
