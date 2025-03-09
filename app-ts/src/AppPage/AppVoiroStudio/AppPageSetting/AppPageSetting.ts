import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";
import { AppPageSettingBoard } from "./AppPageSettingBoard";
import { ToggleOtherWindowButton } from "./OpenLauncherButton";

export class AppPageSetting{
    private _Elm_body_setting: Element;
    public appPageSettingBoard: AppPageSettingBoard;
    public openAppPageSettingsButton: ToggleOtherWindowButton;

    constructor() {
        this._Elm_body_setting = document.getElementsByClassName("body_setting")[0];
        this.appPageSettingBoard = new AppPageSettingBoard();
        this.openAppPageSettingsButton = new ToggleOtherWindowButton(this.appPageSettingBoard).setParentElement(this._Elm_body_setting);
        document.body.appendChild(this.appPageSettingBoard.component.element);
    }
}