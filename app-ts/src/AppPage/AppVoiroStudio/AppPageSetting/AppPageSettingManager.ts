import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";
import { AppPageSetting } from "./AppPageSetting";
import { OpenAppPageSettingsButton } from "./OpenLauncherButton";

export class AppPageSettingManager{
    private _Elm_body_setting: Element;
    public appPageSetting: AppPageSetting;
    public openAppPageSettingsButton: OpenAppPageSettingsButton;

    constructor() {
        this._Elm_body_setting = document.getElementsByClassName("body_setting")[0];
        this.appPageSetting = new AppPageSetting();
        this.openAppPageSettingsButton = new OpenAppPageSettingsButton(this._Elm_body_setting, this.appPageSetting);
        document.body.appendChild(this.appPageSetting.component.element);
    }
}