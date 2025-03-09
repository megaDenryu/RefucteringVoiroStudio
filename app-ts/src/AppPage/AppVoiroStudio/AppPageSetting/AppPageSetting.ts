import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";
import { AppPageSettingBoard } from "./AppPageSettingBoard";
import { OpenAppPageSettingsButton } from "./OpenLauncherButton";

export class AppPageSetting{
    private _Elm_body_setting: Element;
    public appPageSettingBoard: AppPageSettingBoard;
    public openAppPageSettingsButton: OpenAppPageSettingsButton;

    constructor() {
        this._Elm_body_setting = document.getElementsByClassName("body_setting")[0];
        this.appPageSettingBoard = new AppPageSettingBoard();
        this.openAppPageSettingsButton = new OpenAppPageSettingsButton(this._Elm_body_setting, this.appPageSettingBoard);
        document.body.appendChild(this.appPageSettingBoard.component.element);
    }
}