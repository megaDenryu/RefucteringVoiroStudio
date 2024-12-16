import { doc } from "prettier";
import { ObjectInputComponent } from "../../UiComponent/TypeInput/TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { AppSettingsModel } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingModel";
import { RequestAPI } from "../../Web/RequestApi";
import { AppSettingInitReq } from "../../ZodObject/DataStore/AppSetting/AppSettingModel/AppSettingInitReq";
import { generateDefaultObject } from "../../Extend/ZodExtend/ZodExtend";
import "../../UiComponent/TypeInput/TypeComponents/Component.css";

//todo : 保存処理とかをする必要がある。

export class SettingPage  {
    private testMode: boolean = true
    public readonly title = "全体設定"
    private _appSettingModel: AppSettingsModel
    private _appSettingComponent: ObjectInputComponent

    constructor() {
        this.initialize()
    }

    async initialize() {
        if (this.testMode) {
            this._appSettingModel = generateDefaultObject(AppSettingsModel)//AppSettingsModel.parse({});
            console.log("test",this._appSettingModel) // {}が返ってくる
        } else {
            this._appSettingModel = await this.requestAppSettingModel()
        }
        this._appSettingComponent = new ObjectInputComponent(this.title, AppSettingsModel, this._appSettingModel)
        document.body.appendChild(this._appSettingComponent.component.element)
        this.onAddedToDom()
    }

    public async requestAppSettingModel(): Promise<AppSettingsModel> {
        let req:AppSettingInitReq = {
            page_mode: "setting",
            client_id: "test"
        }

        //1. jsonに変換する
        const data = JSON.stringify(req);
        console.log(data);
        //2. 非同期fetchする
        const response = await fetch(RequestAPI.rootURL + "appSettingInit", {//"DecideChara", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })

        const json:string = await response.json();
        const appSettingsModel:AppSettingsModel = JSON.parse(json);
        return appSettingsModel;
    }

    onAddedToDom() {
        this._appSettingComponent.onAddedToDom()
    }
}

const setting = new SettingPage()