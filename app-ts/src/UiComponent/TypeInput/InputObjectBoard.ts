import { DragMover, IDragAble } from "../Base/DragableComponent";
import { BaseComponent, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";


export class InputObjectBoard implements IHasComponent, IDragAble {
    private readonly Def = HtmlElementInput.new(
        `
            <div class="InputObjectBoard">
                <div class="SquareBoard"></div>
            </div>
        `,
        {
            "SquareBoard": "SquareBoard"
        }
    );

    public readonly component: BaseComponent<typeof this.Def["classNames"]>;
    public readonly dragMover: DragMover;
    private _squareBoardComponent: SquareBoardComponent;
    private _numberInputComponent: NumberInputComponent;

    constructor() {
        this._squareBoardComponent = new SquareBoardComponent(1000, 1000);
        this._squareBoardComponent.dragMover.setEnableDrag(false);
        this._numberInputComponent = new NumberInputComponent("番号", 0);
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.dragMover = new DragMover(this);
        this.BindArrow();
        this.setZIndex();
    }

    private BindArrow() {
        this.component.createArrowBetweenComponents(this, this._squareBoardComponent, this.Def.classNames.SquareBoard);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._numberInputComponent);
    }

    private setZIndex() {
        this._squareBoardComponent.component.setZIndex(1);
        this._numberInputComponent.component.setZIndex(2);

    }

    


}