import { z, ZodTypeAny } from "zod";
import { generateDefaultObject } from "../../Extend/ZodExtend/ZodExtend";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import {
  IComponentManager,
  オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する,
  オブジェクトデータの特定の子要素の配列から特定番号を削除する,
} from "../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponentWithSaveButton } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { AppSettingsModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingModel";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { RequestAPI } from "../../Web/RequestApi";
import { AppSettingInitReq } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingInitReq";
import { RecordPath } from "../../UiComponent/TypeInput/RecordPath";
import { recusiveRegisterUpdateChildSegment } from "../../UiComponent/TypeInput/TypeComponents/ICollectionComponent";
import { CevioAIVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingReq";
import { CevioAIVoiceSettingModelReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModelReq";
import { ObjectInputComponent } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { CevioAIVoiceSettingModelFormat } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSettingFormat/CevioAIVoiceSettingFormat";

export class CevioAIVoiceSetting implements IComponentManager, IOpenCloseWindow {
  private testMode: boolean = false;
  public readonly title = "全体設定";
  public manageData: CevioAIVoiceSettingModel;
  private _squareBoardComponent: SquareBoardComponent;
  // private _manageDataSettingComponent:ObjectInputComponentWithSaveButton<CevioAIVoiceSettingModel>
  private _manageDataSettingComponent: ObjectInputComponent<CevioAIVoiceSettingModel>;
  private _closeButton: NormalButton;
  private _reqInfo: TtsSoftWareVoiceSettingReq;

  /**
   * @param SchemaType スキーマーの型
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  public constructor(req: CevioAIVoiceSettingReq) {
    this._squareBoardComponent = new SquareBoardComponent(
      "設定画面",
      null,
      null,
      [],
      {},
      null,
      true
    );
    this._closeButton = new NormalButton("閉じる", "warning");
    this._reqInfo = req;
    this.initialize(req);
  }

  /**
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  private async initialize(req: {}) {
    if (this.testMode) {
      this.manageData = generateDefaultObject(CevioAIVoiceSettingModel); //AppSettingsModel.parse({});
      console.log("test", this.manageData); // {}が返ってくる
    } else {
      this.manageData = await this.requestAppSettingModel(req);
      console.log("real", this.manageData); // {}が返ってくる
    }
    // this._manageDataSettingComponent = new ObjectInputComponentWithSaveButton(this.title, CevioAIVoiceSettingModel, this.manageData, null, this);
    this._manageDataSettingComponent = new ObjectInputComponent(
      this.title,
      CevioAIVoiceSettingModel,
      this.manageData,
      null,
      this, CevioAIVoiceSettingModelFormat
    );
    this._manageDataSettingComponent.component.addCSSClass("positionRelative");
    this._manageDataSettingComponent.component.removeCSSClass(
      "positionAbsolute"
    );
    this._squareBoardComponent.addComponentToHeader(this._closeButton);
    this._squareBoardComponent.component.addCSSClass(["positionAbsolute"]);
    this._squareBoardComponent.component.createArrowBetweenComponents(
      this._squareBoardComponent,
      this._manageDataSettingComponent
    );
    this.bindEvents();
    document.body.appendChild(this._squareBoardComponent.component.element);
    this.onAddedToDom();
    //初期位置をウインドウの真ん中の位置にする
    this._squareBoardComponent.setInitialPosition(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
  }

  private async requestAppSettingModel(req: {}): Promise<CevioAIVoiceSettingModel> {
    //1. jsonに変換する
    const data = JSON.stringify(req);
    //2. 非同期fetchする
    const response = await fetch(
      RequestAPI.rootURL + "TtsSoftWareSettingInit",
      {
        //"DecideChara", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    const appSettingsModel: CevioAIVoiceSettingModel = await response.json();

    return appSettingsModel;
  }

  public onAddedToDom() {
    this._manageDataSettingComponent.onAddedToDom();
  }

  private bindEvents() {
    this._closeButton.addOnClickEvent(() => {
      this.close();
    });
    //セーブをオブジェクトインプットコンポーネントに,dartyになったときにセーブを実行するように登録
    this._manageDataSettingComponent.addOnDartyEvent(() => {
      this._manageDataSettingComponent.save();
      this.saveAllSettings("CevioAIVoiceSetting");
      console.log("セーブした");
    });
  }

  private saveAllSettings(url: string) {
    // セーブデータの状態を更新する
    const updatedSettings = this._manageDataSettingComponent.getValue();
    console.log(updatedSettings);

    // セーブデータを送信する
    this.sendSettings(updatedSettings, url);
  }

  private sendSettings(settings: CevioAIVoiceSettingModel, url: string) {
    const settingsReq: CevioAIVoiceSettingModelReq = {
      page_mode: this._reqInfo.page_mode,
      client_id: this._reqInfo.client_id,
      character_id: this._reqInfo.character_id,
      cevio_ai_voice_setting: settings,
    };
    // セーブデータを送信するロジックをここに記述
    fetch(RequestAPI.rootURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsReq),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    this.sendSettings(this.manageData, "CevioAIVoiceSetting");
  }

  public オブジェクトデータの特定の子要素の配列から特定番号を削除する(
    recordPath: RecordPath
  ): void {
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(
      this,
      recordPath
    );
    this.sendSettings(this.manageData, "CevioAIVoiceSetting");
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
}

export function createCevioAIVoiceSetting(
  character_id: string
): CevioAIVoiceSetting {
  const cevioAIVoiceSettingReq: CevioAIVoiceSettingReq = {
    page_mode: "App",
    client_id: "test",
    character_id: character_id,   
  };

  const cevioAIVoiceSetting = new CevioAIVoiceSetting(cevioAIVoiceSettingReq);
  return cevioAIVoiceSetting;
}
