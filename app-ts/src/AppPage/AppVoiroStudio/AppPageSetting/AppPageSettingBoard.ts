import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { BaseComponent, IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IHasSquareBoard } from "../../../UiComponent/Board/IHasSquareBoard";
import { IToggleWindow } from "../../../UiComponent/Board/IToggleWindow";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { Launcher } from "../../Launcher/Launcher";
import { ToggleOtherWindowButton } from "./OpenLauncherButton";

export class AppPageSettingBoard implements IHasSquareBoard, IHasComponent, IToggleWindow {
    public readonly title: string = "このページの設定";
    public component: BaseComponent;
    public squareBoardComponent: SquareBoardComponent;
    public launcher: Launcher;
    public closeButton: ToggleOtherWindowButton;
    public isOpenState:ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);

    constructor() {
        this.squareBoardComponent = new SquareBoardComponent(
            this.title,
            null,null,
            [],
            {},
            null,
            true
        );
        this.component = this.squareBoardComponent.component.setAsParentComponent();
        this.launcher = new Launcher().setAsChildComponent();
        this.closeButton = new ToggleOtherWindowButton(this);
        this.initialize();
        this.close();
    }

    private initialize() {
        this.squareBoardComponent.addComponentToHeader(this.closeButton.component);
        this.component.createArrowBetweenComponents(this,this.launcher);
        
    }

    public delete(): void {
        this.component.delete();
    }

    public onAddedToDom(): void {
    }

    public optimizeBoardSize(): void {
    }

    public isOpen(): boolean {
        return this.component.isShow;
    }

    public toggle() {
        if (this.component.isShow) {this.close();} 
        else {this.open();}
    }

    public open() {
        this.component.show();
        this.component.element.style.transform = "translate(318px, -500px)";
        this.isOpenState.set(true);
    }

    public close() {
        this.component.hide();
        this.isOpenState.set(false);
    }

}