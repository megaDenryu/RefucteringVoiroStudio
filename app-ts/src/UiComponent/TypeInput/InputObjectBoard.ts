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
import "./TypeComponents/Component.css";

export const VoiceRoidList = z.array(z.string());
export const HumanState = z.object({
    atack: z.number(),
    emotionList: z.array(z.enum(["悲しい", "嬉しい", "怒り"])),
    HP: z.number(),
});

export const VoiceRoidState = z.object({
    voiceRoidList: VoiceRoidList,
    voiceRoidStateDict: HumanState,
});

export const GameState = z.object({
    humanNumber: z.number(),
    humanList: VoiceRoidList,
    humanStateDict: HumanState,
    voiceRoidState: VoiceRoidState,

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
    private _objectInputComponent: ObjectInputComponent;
    private _boolean

    constructor() {
        this._squareBoardComponent = new SquareBoardComponent("テストボード",1000, 1000);
        const gameState:GameState = {
            humanNumber: 1, 
            humanList: ["結月ゆかり","初音ミク"], 
            humanStateDict: {
                atack: 10,
                emotionList: ["悲しい", "嬉しい", "怒り"],
                HP: 100
            },
            voiceRoidState: {
                voiceRoidList: ["結月ゆかり","初音ミク"], 
                voiceRoidStateDict: {
                    atack: 10,
                    emotionList: ["悲しい", "嬉しい", "怒り"],
                    HP: 100
                }
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
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._objectInputComponent);
    }

    private setZIndex() {

    }

    public onAddedToDom() {
        this._objectInputComponent.optimizeBoardSize();
    }
}