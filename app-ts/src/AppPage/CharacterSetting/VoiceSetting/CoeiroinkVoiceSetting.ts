import { generateDefaultObject } from "../../../Extend/ZodExtend/ZodExtend";
import { IHasComponent, BaseComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { createOpenCloseButton, OpenCloseState, ToggleButton } from "../../../UiComponent/Button/ToggleButton.ts/ToggleButton";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponent } from "../../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { CoeiroinkVoiceSettingModel } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { CoeiroinkVoiceSettingModelFormat } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModelFormat";
import { TtsSoftWareVoiceSettingReq } from "../../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { ISaveSetting } from "../ISaveSetting";
import { IVoiceSetting } from "./IVoiceSetting";

export class CoeiroinkVoiceSetting implements IComponentManager, IVoiceSetting, IHasComponent {
  public readonly component: BaseComponent;
  private testMode: boolean = false;
  public readonly title = "ボイス設定";
  public manageData: CoeiroinkVoiceSettingModel;
  private settingSaver:ISaveSetting<CoeiroinkVoiceSettingModel>;
  private _squareBoardComponent: SquareBoardComponent;
  private _manageDataSettingComponent: ObjectInputComponent<CoeiroinkVoiceSettingModel>;
  private _開閉Button: ToggleButton<OpenCloseState>;

  public get 読み上げ間隔() {
    return this.manageData.読み上げ間隔;
  }

  /**
   * @param SchemaType スキーマーの型
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  public constructor(req: TtsSoftWareVoiceSettingReq, voiceSetting:CoeiroinkVoiceSettingModel|undefined, settingSaver:ISaveSetting<CoeiroinkVoiceSettingModel>) {
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
    this.manageData = voiceSetting ?? generateDefaultObject(CoeiroinkVoiceSettingModel);
    this.settingSaver = settingSaver;
    this.initialize();
  }

  private initialize() {
    this._manageDataSettingComponent = new ObjectInputComponent(
      this.title,
      CoeiroinkVoiceSettingModel,
      this.manageData,
      null,
      this, CoeiroinkVoiceSettingModelFormat
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
      console.log("セーブした");
    });
  }

  private saveAllSettings() {
    // セーブデータの状態を更新する
    const updatedSettings = this._manageDataSettingComponent.getValue();
    this.manageData = updatedSettings;
    // セーブデータを送信する
    this.sendSettings(updatedSettings);
  }

  private sendSettings(settings: CoeiroinkVoiceSettingModel) {
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
    this._squareBoardComponent.component.element.remove();
  }
}

export function createCoeiroinkVoiceSetting(
  character_id: string, voiceSetting:CoeiroinkVoiceSettingModel|undefined, settingSaver:ISaveSetting<CoeiroinkVoiceSettingModel>
): CoeiroinkVoiceSetting {
  const ttsSoftWareVoiceSettingReq: TtsSoftWareVoiceSettingReq = {
    page_mode: "App",
    client_id: "test",
    character_id: character_id,   
  };

  const coeiroinkVoiceSetting = new CoeiroinkVoiceSetting(ttsSoftWareVoiceSettingReq, voiceSetting, settingSaver);
  return coeiroinkVoiceSetting;
}
