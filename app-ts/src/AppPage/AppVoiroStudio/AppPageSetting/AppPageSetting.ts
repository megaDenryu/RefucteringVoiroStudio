import { BaseComponent, IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IHasSquareBoard } from "../../../UiComponent/Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../../UiComponent/Board/SquareComponent";
import { Launcher } from "../../Launcher/Launcher";

export class AppPageSetting implements IHasSquareBoard, IHasComponent {
    public readonly title: string = "このページの設定";
    public component: BaseComponent;
    public squareBoardComponent: SquareBoardComponent;
    public launcher: Launcher;

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
        this.initialize();
    }

    private initialize() {
        this.component.createArrowBetweenComponents(this,this.launcher);
    }

    public delete(): void {
        this.component.delete();
    }

    public onAddedToDom(): void {
    }

    public optimizeBoardSize(): void {
    }

}