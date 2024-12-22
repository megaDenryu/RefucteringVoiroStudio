import { doc } from "prettier";
import { ObjectInputComponent } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { AppSettingsModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingModel";
import { RequestAPI } from "../../Web/RequestApi";
import { AppSettingInitReq } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingInitReq";
import { generateDefaultObject } from "../../Extend/ZodExtend/ZodExtend";
import "../../UiComponent/TypeInput/TypeComponents/Component.css";
import { ToggleFormatStateDisplay, ToggleFormatStateDisplayの使い方 } from "../../UiComponent/Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";

//todo : 保存処理とかをする必要がある。

export class SettingPage  {
    private testMode: boolean = false
    public readonly title = "全体設定"
    private _appSettingModel: AppSettingsModel
    private _squareBoardComponent: SquareBoardComponent
    private _saveButton: NormalButton
    private _appSettingComponent: ObjectInputComponent<AppSettingsModel>
    
    constructor() {
        this._squareBoardComponent = new SquareBoardComponent("設定画面", 400, 600)
        this._saveButton = new NormalButton("保存", "normal")
        this._squareBoardComponent.addComponentToHeader(this._saveButton)
        this.initialize()
    }

    async initialize() {
        if (this.testMode) {
            this._appSettingModel = generateDefaultObject(AppSettingsModel)//AppSettingsModel.parse({});
            console.log("test",this._appSettingModel) // {}が返ってくる
        } else {
            this._appSettingModel = await this.requestAppSettingModel()
            console.log("real",this._appSettingModel) // {}が返ってくる
        }
        this._appSettingComponent = new ObjectInputComponent(this.title, AppSettingsModel, this._appSettingModel)
        this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, this._appSettingComponent)
        this.bindEvents()
        document.body.appendChild(this._squareBoardComponent.component.element)
        this.onAddedToDom()
    }

    private async requestAppSettingModel(): Promise<AppSettingsModel> {
        let req:AppSettingInitReq = {
            page_mode: "setting",
            client_id: "test"
        }

        //1. jsonに変換する
        const data = JSON.stringify(req);
        //2. 非同期fetchする
        const response = await fetch(RequestAPI.rootURL + "appSettingInit", {//"DecideChara", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })

        const json:string = await response.json();
        
        const appSettingsModel:AppSettingsModel = json as AppSettingsModel//JSON.parse(json);
        return appSettingsModel;
    }



    onAddedToDom() {
        this._appSettingComponent.onAddedToDom()
    }

    bindEvents() {
        /**
         * 実装したいイベントはセーブボタンを押したときに
         * - セーブデータの状態をだーディーになってるものから更新する
         * - セーブデータを送信する
         */
        this._saveButton.addOnClickEvent(() => {
            this.saveSettings()
        })
    }

    private saveSettings() {
        // セーブデータの状態を更新する
        const updatedSettings = this._appSettingComponent.getValue();
        console.log(updatedSettings)
        
        // セーブデータを送信する
        this.sendSettings(updatedSettings);
    }

    private sendSettings(settings: AppSettingsModel) {
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
}

const setting = new SettingPage()