import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";
import { AppPageSettingBoard } from "./AppPageSettingBoard";

export class OpenAppPageSettingsButton {
    public appPageSetting: AppPageSettingBoard;
    private button: NormalButton;
    private isOpen: boolean = false;
    constructor(parent: Element, appPageSetting: AppPageSettingBoard) {
        this.appPageSetting = appPageSetting;
        this.button = new NormalButton("設定を開く","OpenSettingLauncherButton").addOnClickEvent(this.toggle.bind(this));
        parent.appendChild(this.button.component.element);
        this.close();
    }

    public toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open() {
        this.appPageSetting.component.show();
        this.isOpen = true;
        // launcherにtransform: translate(318px, -500px);を設定する
        this.appPageSetting.component.element.style.transform = "translate(318px, -500px)";
    }

    public close() {
        this.appPageSetting.component.hide();
        this.isOpen = false;
    }
}