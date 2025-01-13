import { z, ZodString } from "zod";
import { DragMover, IDragAble } from "../Base/DragableComponent";
import { BaseComponent, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { SquareBoardComponent } from "../Board/SquareComponent";
import "./TypeComponents/Component.css";
import { ObjectInputComponentWithSaveButton } from "./TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { IComponentManager } from "./TypeComponents/IComponentManager";

export const VoiceRoidList = z.array(z.string());
export const HumanState = z.object({
    atack: z.number(),
    emotionList: z.array(z.enum(["悲しい", "嬉しい", "怒り"])),
    HP: z.number(),
});

export const VoiceRoidState = z.object({
    購入済み: z.boolean(),
    voiceRoidList: VoiceRoidList,
    voiceRoidStateDict: HumanState,
});

export const GameState = z.object({
    humanNumber: z.number(),
    humanList: VoiceRoidList,
    humanStateDict: z.array(z.array(HumanState)),
    voiceRoidState: VoiceRoidState,
    emotion: z.record(z.number()),
    キャラへの感情: z.record(z.enum(["悲しい", "嬉しい", "怒り"])),

});
export type GameState = z.infer<typeof GameState>;

export class InputObjectBoard implements IHasComponent, IDragAble, IComponentManager {
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

    public manageData: GameState;
    public readonly component: BaseComponent<typeof this.Def["classNames"]>;
    public readonly dragMover: DragMover;
    private _squareBoardComponent: SquareBoardComponent;
    private _objectInputComponent: ObjectInputComponentWithSaveButton<GameState>;
    private _boolean

    constructor() {
        this._squareBoardComponent = new SquareBoardComponent("テストボード",1000, 1000);
        this.manageData = {
            humanNumber: 1, 
            humanList: ["結月ゆかり","初音ミク"], 
            humanStateDict: [[{
                atack: 10,
                emotionList: ["悲しい", "嬉しい", "怒り"],
                HP: 100
            }]],
            voiceRoidState: {
                購入済み: true,
                voiceRoidList: ["結月ゆかり","初音ミク"], 
                voiceRoidStateDict: {
                    atack: 10,
                    emotionList: ["悲しい", "嬉しい", "怒り"],
                    HP: 100
                }
            },
            emotion: {
                "悲しい": 1,
            },
            キャラへの感情: {
                "結月ゆかり": "悲しい",
            }
        }
        this._objectInputComponent = new ObjectInputComponentWithSaveButton("ゲーム状態", GameState, this.manageData, null, this,null);
        // this._objectInputComponent = new ObjectInputComponent("ゲーム状態", GameState, gameState);
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.dragMover = new DragMover(this);
        this.BindArrow();
        this.setZIndex();

        //全てのRayoutChangeButtonにイベントを追加
        let rayoutChangeButtonList = this.component.element.getElementsByClassName("RayoutChangeButton");
        for (let i = 0; i < rayoutChangeButtonList.length; i++) {
            rayoutChangeButtonList[i].addEventListener("click", () => {
                    this._objectInputComponent.optimizeBoardSize();
            });
        }
    }

    private BindArrow() {
        this.component.createArrowBetweenComponents(this, this._squareBoardComponent, this.Def.classNames.SquareBoard);
        this.component.createArrowBetweenComponents(this._squareBoardComponent, this._objectInputComponent);
    }

    private setZIndex() {

    }

    public onAddedToDom() {
        this._objectInputComponent.optimizeBoardSize();
        this._objectInputComponent.optimizeBoardSize(); //なぜか２回呼び出さないと、高さが最適化できない
    }

    public delete() {
        this.component.delete();
    }

    public オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(): void
    {
        
    }

    public オブジェクトデータの特定の子要素の配列から特定番号を削除する(): void
    {
        
    }
    
}