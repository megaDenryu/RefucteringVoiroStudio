import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { Launcher } from "../../Launcher/Launcher";





export class OpenLauncherButton {
    public launcher: Launcher;
    private button: NormalButton;
    private isOpen: boolean = false;
    constructor(parent: Element, launcher: Launcher) {
        this.launcher = launcher;
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
        console.log("toggle");
    }

    public open() {
        this.launcher.component.show();
        this.isOpen = true;
        // launcherにtransform: translate(318px, -500px);を設定する
        this.launcher.component.element.style.transform = "translate(318px, -500px)";
    }

    public close() {
        this.launcher.component.hide();
        this.isOpen = false;
    }
}