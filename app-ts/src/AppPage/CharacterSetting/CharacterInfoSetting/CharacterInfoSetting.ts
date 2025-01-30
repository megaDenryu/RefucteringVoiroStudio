import { generateDefaultObject } from "../../../Extend/ZodExtend/ZodExtend";
import { IHasComponent, BaseComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { ObjectInputComponent } from "../../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { CharacterInfo } from "../../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { ISaveCharacterInfo, ISaveSetting } from "../ISaveSetting";
import { ICharacterInfoSetting } from "./ICharacterInfoSetting";


export class CharacterInfoSetting implements IComponentManager, IOpenCloseWindow, ICharacterInfoSetting, IHasComponent {
  public readonly component: BaseComponent;
  private testMode: boolean = false;
  public readonly title = "キャラクター情報設定";
  public manageData: CharacterInfo;
  private settingSaver:ISaveCharacterInfo;
  private _squareBoardComponent: SquareBoardComponent;
  private _manageDataSettingComponent: ObjectInputComponent<CharacterInfo>;
  private _closeButton: NormalButton;

  constructor(voiceSetting:CharacterInfo|undefined, settingSaver:ISaveCharacterInfo) {
    this.manageData = voiceSetting ?? generateDefaultObject(CharacterInfo);
    this.settingSaver = settingSaver;
    this._squareBoardComponent = new SquareBoardComponent(
      "設定画面",
      null,
      null,
      [],
      {},
      null,
      true
    );
    this._manageDataSettingComponent = new ObjectInputComponent(
        this.title,
        CharacterInfo,
        this.manageData,
        null,
        this, CharacterInfoFormat
    );
    this.component = this._squareBoardComponent.component;
    this._closeButton = new NormalButton("閉じる", "warning");
    this.initialize();
  }

  private initialize() {
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
  
    public open(): void {
      this._squareBoardComponent.component.show();
    }
  
    public close(): void {
      this._squareBoardComponent.component.hide();
    }
  
    public delete(): void {
      this._squareBoardComponent.component.element.remove();
    }

}

