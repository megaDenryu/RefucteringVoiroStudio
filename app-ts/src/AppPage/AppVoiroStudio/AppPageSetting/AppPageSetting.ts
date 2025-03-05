import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";
import { OpenLauncherButton } from "./OpenLauncherButton";





export class AppPageSetting{
    private _Elm_body_setting: Element;
    public launcher: Launcher;
    public openLauncherButton: OpenLauncherButton;

    constructor() {
        this._Elm_body_setting = document.getElementsByClassName("body_setting")[0];
        this.launcher = new Launcher();
        this.openLauncherButton = new OpenLauncherButton(this._Elm_body_setting, this.launcher);
        document.body.appendChild(this.launcher.component.element);
    }
}