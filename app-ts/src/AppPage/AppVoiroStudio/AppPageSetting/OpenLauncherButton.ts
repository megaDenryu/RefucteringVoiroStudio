import { IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IToggleWindow } from "../../../UiComponent/Board/IToggleWindow";
import { NormalButton } from "../../../UiComponent/Button/NormalButton/NormalButton";
import { launchCloseButton, launchOpenButton } from "../../Launcher/styles.css";

export class ToggleOtherWindowButton {
    public targetWindow: IToggleWindow;
    private button: NormalButton;
    constructor(targetWindow: IToggleWindow) {
        this.targetWindow = targetWindow;
        this.button = new NormalButton("設定ひらく",launchOpenButton).addOnClickEvent(this.toggle.bind(this));
        this.targetWindow.isOpenState.addMethod((isOpen) => {this.changeButtonState(isOpen);});
        return this;
    }

    public get component():IHasComponent {
        return this.button;
    }

    public setParentElement(parentElement: Element) {
        parentElement.appendChild(this.button.component.element);
        return this;
    }

    public toggle() {
        this.targetWindow.toggle();
    }

    public open() {
        this.targetWindow.open();
    }

    public close() {
        this.targetWindow.close();
    }

    public changeButtonState(isOpen: boolean) {
        if (isOpen) {
            this.button.setText("設定とじる");
            this.button.setView(launchCloseButton)
        } else {
            this.button.setText("設定ひらく");
            this.button.setView(launchOpenButton)
        }
    }
}