import { generateDefaultObject } from "../../../Extend/ZodExtend/ZodExtend";
import { IHasComponent, BaseComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { createOpenCloseButton, OpenCloseState, ToggleButton } from "../../../UiComponent/Button/ToggleButton.ts/ToggleButton";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponent } from "../../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { CharacterName, NickName } from "../../../ValueObject/Character";
import { CharacterInfo } from "../../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { CharacterInfoFormat } from "../../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfoFormat";
import { ISaveCharacterInfo, ISaveSetting } from "../ISaveSetting";
import { ICharacterInfoSetting } from "./ICharacterInfoSetting";


export class CharacterInfoSetting implements IComponentManager, ICharacterInfoSetting, IHasComponent, ICharacterInfoSetting {
  public readonly component: BaseComponent;
  private testMode: boolean = false;
  public readonly title = "キャラクター情報設定";
  public manageData: CharacterInfo;
  private settingSaver:ISaveCharacterInfo;
  private _squareBoardComponent: SquareBoardComponent;
  private _manageDataSettingComponent: ObjectInputComponent<CharacterInfo>;
  private _開閉Button: ToggleButton<OpenCloseState>;

  constructor(characterInfo:CharacterInfo|undefined, settingSaver:ISaveCharacterInfo) {
    this.manageData = characterInfo ?? generateDefaultObject(CharacterInfo);
    this.settingSaver = settingSaver;
    this._squareBoardComponent = new SquareBoardComponent(
      "設定画面",
      null,
      null,
      [],
      {},
      null,
      false
    );
    this._manageDataSettingComponent = new ObjectInputComponent(
        this.title,
        CharacterInfo,
        this.manageData,
        null,
        this, CharacterInfoFormat
    );
    this.component = this._squareBoardComponent.component;
    this._開閉Button = createOpenCloseButton({"title":"開閉ボタン","openAction":()=>{this.open()}, "closeAction":()=>{this.close()}, "defaultState":"goClose"});
    this.initialize();
  }

  private initialize() {
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

  public get nickName(): NickName {
    return NickName.fromDict(this.manageData.nickName);
  }

  public get characterName(): CharacterName {
    return CharacterName.fromDict(this.manageData.characterName);
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
    console.log(updatedSettings);
    this.manageData = updatedSettings;

    // セーブデータを送信する
    this.sendSettings(updatedSettings);
  }

  private sendSettings(settings: CharacterInfo) {
    this.settingSaver.saveCharacterInfo(settings);
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

