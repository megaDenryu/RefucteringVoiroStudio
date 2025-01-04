import { z, ZodTypeAny } from "zod";
import { generateDefaultObject } from "../../Extend/ZodExtend/ZodExtend";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponentWithSaveButton } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { AppSettingsModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingModel";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { RequestAPI } from "../../Web/RequestApi";
import { AppSettingInitReq } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingInitReq";
import { RecordPath } from "../../UiComponent/TypeInput/RecordPath";
import { recusiveRegisterUpdateChildSegment } from "../../UiComponent/TypeInput/TypeComponents/ICollectionComponent";
import { CevioAIVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingReq";

export class CevioAIVoiceSetting<ModelType extends {}> implements IComponentManager {
  private testMode: boolean = false
  public readonly title = "全体設定"
  public manageData: ModelType;
  private _squareBoardComponent: SquareBoardComponent
  private _manageDataSettingComponent: ObjectInputComponentWithSaveButton<ModelType>
  private _closeButton: NormalButton

  /**
   * 
   * @param SchemaType スキーマーの型
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  public constructor(SchemaType: ZodTypeAny, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, req: {}, reqURL: string) {
    this._squareBoardComponent = new SquareBoardComponent("設定画面", 400, 600);
    this._closeButton = new NormalButton("閉じる", "warning")
    this.initialize(SchemaType, schema, req, reqURL);
  }

  /**
   * 
   * @param SchemaType スキーマーの型
   * @param req この設定モデルがデータをサーバーにリクエストするためのリクエストデータ
   * @param reqURL リクエストURL。RequestAPI.rootURLの後に続けるので/はいらない。
   */
  private async initialize(SchemaType: ZodTypeAny, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, req: {}, reqURL: string) {
    if (this.testMode) {
      this.manageData = generateDefaultObject(SchemaType)//AppSettingsModel.parse({});
      console.log("test", this.manageData) // {}が返ってくる
    } else {
      this.manageData = await this.requestAppSettingModel(req, reqURL)
      console.log("real", this.manageData) // {}が返ってくる
    }
    this._manageDataSettingComponent = new ObjectInputComponentWithSaveButton(this.title, schema, this.manageData, null, this);
    this._squareBoardComponent.addComponentToHeader(this._closeButton);
    this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, this._manageDataSettingComponent);
    this.bindEvents()
    document.body.appendChild(this._squareBoardComponent.component.element)
    this.onAddedToDom()
  }

  private async requestAppSettingModel(req: {}, reqURL: string): Promise<ModelType> {
    //1. jsonに変換する
    const data = JSON.stringify(req);
    //2. 非同期fetchする
    const response = await fetch(RequestAPI.rootURL + reqURL, {//"DecideChara", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })

    const json: string = await response.json();

    const appSettingsModel: ModelType = json as unknown as ModelType
    return appSettingsModel;
  }

  public onAddedToDom() {
    this._manageDataSettingComponent.onAddedToDom()
  }

  private bindEvents() {
  }

  private saveAllSettings() {
    // セーブデータの状態を更新する
    const updatedSettings = this._manageDataSettingComponent.getValue();
    console.log(updatedSettings)

    // セーブデータを送信する
    this.sendSettings(updatedSettings);
  }

  private sendSettings(settings: ModelType) {
    // セーブデータを送信するロジックをここに記述
    fetch(RequestAPI.rootURL + "SaveSetting", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  public オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void {
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(this, recordPath, value)
    this.sendSettings(this.manageData);
  }

  public オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath: RecordPath): void {
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(this, recordPath)
    this.sendSettings(this.manageData);
  }
}


export function createCevioAIVoiceSetting(character_id: string) {
  const cevioAIVoiceSettingReq: CevioAIVoiceSettingReq = {
    page_mode: "App",
    client_id: "test",
    character_id: character_id
  }

  const cevioAIVoiceSetting = new CevioAIVoiceSetting<CevioAIVoiceSettingModel>(
    CevioAIVoiceSettingModel,
    CevioAIVoiceSettingModel,
    cevioAIVoiceSettingReq,
    "CevioAIVoiceSettingInit"
  )
}

