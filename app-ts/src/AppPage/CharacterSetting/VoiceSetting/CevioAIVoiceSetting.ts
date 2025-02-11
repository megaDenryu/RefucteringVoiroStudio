import { generateDefaultObject } from "../../../Extend/ZodExtend/ZodExtend";
import { IHasComponent, BaseComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { ToggleButton, OpenCloseState, createOpenCloseButton } from "../../../UiComponent/Button/ToggleButton.ts/ToggleButton";
import { ICharacterSettingSaveModel } from "../../../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponent } from "../../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { CevioAIVoiceSettingModel } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { CevioAIVoiceSettingModelFormat } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModelFormat";
import { CevioAIVoiceSettingModelReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModelReq";
import { CevioAIVoiceSettingReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingReq";
import { TtsSoftWareVoiceSettingReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { ISaveSetting } from "../ISaveSetting";
import { IVoiceSetting } from "./IVoiceSetting";



export class CevioAIVoiceSetting implements IComponentManager, IVoiceSetting, IHasComponent {
  public readonly component: BaseComponent;
  private testMode: boolean = false;
  public readonly title = "音声設定";
  public manageData: CevioAIVoiceSettingModel;
  private settingSaver:ISaveSetting<CevioAIVoiceSettingModel>;
  private _squareBoardComponent: SquareBoardComponent;
  // private _manageDataSettingComponent:ObjectInputComponentWithSaveButton<CevioAIVoiceSettingModel>
  private _manageDataSettingComponent: ObjectInputComponent<CevioAIVoiceSettingModel>;
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
  public constructor(req: CevioAIVoiceSettingReq, voiceSetting:CevioAIVoiceSettingModel|undefined, settingSaver:ISaveSetting<CevioAIVoiceSettingModel>) {
    this._squareBoardComponent = new SquareBoardComponent(
      "設定画面",
      null,
      null,
      [],
      {},
      null,
      false
    );
    this.component = this._squareBoardComponent.component;
    this._開閉Button = createOpenCloseButton({"title":"開閉ボタン","openAction":()=>{this.open()}, "closeAction":()=>{this.close()}, "defaultState":"goClose"});
    this._reqInfo = req;
    this.manageData = voiceSetting ?? generateDefaultObject(CevioAIVoiceSettingModel);
    this.settingSaver = settingSaver;
    this.initialize();
  }

  /**
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  private async initialize() {
    this._manageDataSettingComponent = new ObjectInputComponent(
      this.title,
      CevioAIVoiceSettingModel,
      this.manageData,
      null,
      this, CevioAIVoiceSettingModelFormat
    );
    this._manageDataSettingComponent.component.setAsChildComponent();
    this.component.setAsParentComponent();
    this._squareBoardComponent.addComponentToHeader(this._開閉Button);
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

  private sendSettings(settings: CevioAIVoiceSettingModel) {
    this.settingSaver.saveVoiceSetting(settings);
  }

  public オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(
    recordPath: RecordPath,
    value: any
  ): void {
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(
      this,
      recordPath,
      value
    );
    this.sendSettings(this.manageData);
  }

  public オブジェクトデータの特定の子要素の配列から特定番号を削除する(
    recordPath: RecordPath
  ): void {
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(
      this,
      recordPath
    );
    this.sendSettings(this.manageData);
  }

  private open(): void {
    // this._squareBoardComponent.component.show();
    this._manageDataSettingComponent.component.show();
  }

  private close(): void {
    // this._squareBoardComponent.component.hide();
    this._manageDataSettingComponent.component.hide();
  }

  public delete(): void {
    this._squareBoardComponent.component.delete();
  }
}

export function createCevioAIVoiceSetting(
  character_id: string, characterSaveData:ICharacterSettingSaveModel<CevioAIVoiceSettingModel>, settingSaver:ISaveSetting<CevioAIVoiceSettingModel>
): CevioAIVoiceSetting {
  const cevioAIVoiceSettingReq: CevioAIVoiceSettingReq = {
    page_mode: "App",
    client_id: "test",
    character_id: character_id,   
  };

  const cevioAIVoiceSetting = new CevioAIVoiceSetting(cevioAIVoiceSettingReq, characterSaveData.voiceSetting, settingSaver);
  return cevioAIVoiceSetting;
}
