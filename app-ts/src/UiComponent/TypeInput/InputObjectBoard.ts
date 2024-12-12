import { z, ZodString } from "zod";
import { DragMover, IDragAble } from "../Base/DragableComponent";
import { BaseComponent, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { ArrayInputComponent } from "./TypeComponents/ArrayInputComponent/ArrayInputComponent";
import { BooleanInputComponent } from "./TypeComponents/BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "./TypeComponents/EnumInputComponent/SelecteValueInfo";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";
import { StringInputComponent } from "./TypeComponents/StringInputComponent/StringInputComponent";
import { ObjectInputComponent } from "./TypeComponents/ObjectInputComponent/ObjectInputComponent";

export const VoiceRoidList = z.array(z.string());

export const GameState = z.object({
    humanNumber: z.number(),
    humanList: VoiceRoidList,
    humanStateDict: z.object({
        emotionList: z.array(z.enum(["悲しい", "嬉しい", "怒り"])),
        HP: z.number(),

    })
});
export type GameState = z.infer<typeof GameState>;

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
    // private _numberInputComponent: NumberInputComponent;
    // private _stringInputComponent: StringInputComponent;
    // private _selecterInputComponent: EnumInputComponent;
    // private _booleanInputComponent: BooleanInputComponent;
    // private _arrayInputComponent: ArrayInputComponent<ZodString>;
    private _objectInputComponent: ObjectInputComponent;
    private _boolean

    constructor() {
        this._squareBoardComponent = new SquareBoardComponent("テストボード",1000, 1000);
        // this._squareBoardComponent.dragMover.setEnableDrag(false);
        // this._numberInputComponent = new NumberInputComponent("番号", 0);
        // this._stringInputComponent = new StringInputComponent("背景情報", "ボイスロイド");
        
        // this._selecterInputComponent = new EnumInputComponent("感情",new SelecteValueInfo(["悲しい", "嬉しい", "怒り"],"悲しい"));
        // this._booleanInputComponent = new BooleanInputComponent("真偽", false);
        // this._arrayInputComponent = new ArrayInputComponent<ZodString>("ボイロリスト", VoiceRoidList, ["結月ゆかり", "初音ミク", "巡音ルカ"]);
        const gameState:GameState = {
            humanNumber: 1, 
            humanList: ["結月ゆかり","初音ミク"], 
            humanStateDict: {
                emotionList: ["悲しい", "嬉しい", "怒り"],
                HP: 100
            }
        }
        this._objectInputComponent = new ObjectInputComponent("ゲーム状態", GameState, gameState);
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.dragMover = new DragMover(this);
        this.BindArrow();
        this.setZIndex();
    }

    private BindArrow() {
        this.component.createArrowBetweenComponents(this, this._squareBoardComponent, this.Def.classNames.SquareBoard);
        // this.component.createArrowBetweenComponents(this._squareBoardComponent, this._numberInputComponent);
        // this.component.createArrowBetweenComponents(this._squareBoardComponent, this._stringInputComponent);
        // this.component.createArrowBetweenComponents(this._squareBoardComponent, this._selecterInputComponent);
        // this.component.createArrowBetweenComponents(this._squareBoardComponent, this._booleanInputComponent);
        // this.component.createArrowBetweenComponents(this._squareBoardComponent, this._arrayInputComponent);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._objectInputComponent);
    }

    private setZIndex() {
        // this._squareBoardComponent.component.setZIndex(1);
        // this._numberInputComponent.component.setZIndex(2);
        // this._stringInputComponent.component.setZIndex(2);
        // this._selecterInputComponent.component.setZIndex(2);
        // this._booleanInputComponent.component.setZIndex(2);
        // this._arrayInputComponent.component.setZIndex(2);
        // this._objectInputComponent.component.setZIndex(2);

    }

    public onAddedToDom() {
        this._objectInputComponent.optimizeBoardSize();
    }
}