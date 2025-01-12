import { doc } from "prettier";
import { ObjectInputComponent } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { AppSettingsModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingModel";
import { RequestAPI } from "../../Web/RequestApi";
import { AppSettingInitReq } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingInitReq";
import { generateDefaultObject } from "../../Extend/ZodExtend/ZodExtend";
import "../../UiComponent/TypeInput/TypeComponents/Component.css";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { RecordPath } from "../../UiComponent/TypeInput/RecordPath";
import { recusiveRegisterUpdateChildSegment, recusiveRegisterUpdateChildSegmentToNewChild } from "../../UiComponent/TypeInput/TypeComponents/ICollectionComponent";
import { ObjectInputComponentWithSaveButton } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { IComponentManager, オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する, オブジェクトデータの特定の子要素の配列から特定番号を削除する } from "../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { createWebSocket } from "./SettingWebsocket";
import { ExtendFunction } from "../../Extend/extend";

//todo : 保存処理とかをする必要がある。

export class SettingPage2 implements IComponentManager {
    private testMode: boolean = false;
    public readonly title = "全体設定";
    public manageData: AppSettingsModel;
    private _squareBoardComponent: SquareBoardComponent;
    private _saveButton: NormalButton;
    private _appSettingComponent: ObjectInputComponentWithSaveButton<AppSettingsModel>;
    private _websocket: WebSocket;
    
    constructor() {
        this._squareBoardComponent = new SquareBoardComponent("設定画面", 400, 600)
        this._saveButton = new NormalButton("保存", "normal")
        this._squareBoardComponent.addComponentToHeader(this._saveButton)
        this.initialize()
        this._websocket = createWebSocket(
            {
                clientId: ExtendFunction.uuid(),
                setting_mode: "AppSettings",
                page_mode: "Setting",
            },
            this.handleWebSocketMessage.bind(this)
        );
    }

    private async initialize() {
        if (this.testMode) {
            this.manageData = generateDefaultObject(AppSettingsModel)//AppSettingsModel.parse({});
            console.log("test",this.manageData) // {}が返ってくる
        } else {
            this.manageData = await this.requestAppSettingModel()
            console.log("real",this.manageData) // {}が返ってくる
        }
        this._appSettingComponent = new ObjectInputComponentWithSaveButton(this.title, AppSettingsModel, this.manageData, null, this)
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
        const response = await fetch(RequestAPI.rootURL + "appSettingInit", {
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



    public onAddedToDom() {
        this._appSettingComponent.onAddedToDom()
    }

    private bindEvents() {
        /**
         * 実装したいイベントはセーブボタンを押したときに
         * - セーブデータの状態をだーディーになってるものから更新する
         * - セーブデータを送信する
         */
        this._saveButton.addOnClickEvent(() => {
            this.saveAllSettings()
        })

        this.recusiveRegisterUpdateChildSegment()
    }

    private saveAllSettings() {
        // セーブデータの状態を更新する
        const updatedSettings = this._appSettingComponent.getValue();
        console.log(updatedSettings)
        
        // セーブデータを送信する
        this.sendSettings(updatedSettings);
    }

    private sendSettings2(settings: AppSettingsModel) {
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

    private sendSettings(settings: AppSettingsModel) {
        // WebSocket を使用してデータを送信
        console.log(this._websocket.readyState);
        if (this._websocket.readyState === WebSocket.OPEN) {
            console.log("Sending");
            this._websocket.send(JSON.stringify(settings));
        } else {
            console.error('WebSocket is not open');
        }
    }

    //再帰的に「セーブボタン各子要素のセーブボタンが押されたときのイベント」を登録する
    public recusiveRegisterUpdateChildSegment(): void
    {
        recusiveRegisterUpdateChildSegment(
            this._appSettingComponent, 
            "SettingPage2",
            (recordPath:RecordPath, value:any) => {
                this.オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath, value);
                // セーブデータを送信する
                this.sendSettings(this.manageData);
            }
        )
    }

    public オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath:RecordPath, value:any) : void {
        オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(this, recordPath, value)
        this.sendSettings(this.manageData);
    }

    public オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath:RecordPath): void {
        オブジェクトデータの特定の子要素の配列から特定番号を削除する(this, recordPath)
        this.sendSettings(this.manageData);
    }

    // WebSocket メッセージを処理する関数
    private handleWebSocketMessage(event: MessageEvent) {
        try {
            const data: AppSettingsModel = JSON.parse(event.data);
            console.log("Received data:", data);

            // 受信したデータを処理する
            this.processAppSettings(data);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    }

    // 受信したデータを処理する関数
    private processAppSettings(settings: AppSettingsModel) {
        // 設定データを処理するロジックをここに追加
        this.manageData = settings;
        console.log("データを受信しました。", settings);
        this._appSettingComponent.setValueWithOutSave(settings);
    }
}


const setting = new SettingPage2()