import { DragMover, IDragAble } from "../Base/DragableComponent";
import { BaseComponent, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { BooleanInputComponent } from "./TypeComponents/BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "./TypeComponents/EnumInputComponent/SelecteValueInfo";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";
import { StringInputComponent } from "./TypeComponents/StringInputComponent/StringInputComponent";


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
    private _stringInputComponent: StringInputComponent;
    private _selecterInputComponent: EnumInputComponent;
    private _booleanInputComponent: BooleanInputComponent;
    private 

    constructor() {
        this._squareBoardComponent = new SquareBoardComponent(1000, 1000);
        // this._squareBoardComponent.dragMover.setEnableDrag(false);
        this._numberInputComponent = new NumberInputComponent("番号", 0);
        this._stringInputComponent = new StringInputComponent("背景情報", "ボイスロイド");
        
        this._selecterInputComponent = new EnumInputComponent(new SelecteValueInfo(["悲しい", "嬉しい", "怒り"],"悲しい"));
        this._booleanInputComponent = new BooleanInputComponent("真偽", false);
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.dragMover = new DragMover(this);
        this.BindArrow();
        this.setZIndex();
    }

    private BindArrow() {
        this.component.createArrowBetweenComponents(this, this._squareBoardComponent, this.Def.classNames.SquareBoard);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._numberInputComponent);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._stringInputComponent);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._selecterInputComponent);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._booleanInputComponent);
    }

    private setZIndex() {
        this._squareBoardComponent.component.setZIndex(1);
        this._numberInputComponent.component.setZIndex(2);
        this._stringInputComponent.component.setZIndex(2);

    }

    


}