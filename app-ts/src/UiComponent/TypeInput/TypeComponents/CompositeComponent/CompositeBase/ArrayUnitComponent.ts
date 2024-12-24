import { z } from "zod";
import { BaseComponent, IHasComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { IToggleFormatStateDisplay } from "../../../../Display/IToggleFormatStateDisplay";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IInputComponet } from "../../IInputComponet";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";
import { ICompositeBase, IHasInputComponent } from "../ICompositeComponentList";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";


/**
 * CollectionUnitComponentは、ArrayInputComponentやObjectInputComponentの要素として表示されるコンポーネントです。
 * TypeInputComponentに対して様々なボタンやDisplayを追加するために使用されます。
 * 
 * ArrayUnitComponent は、ArrayInputComponentの要素として表示されるコンポーネントです。
 * ArrayInputComponent内で使用する、insertやremoveなどのボタンを提供します。
 * 
 */

export interface IArrayUnitComponent extends ICompositeBase{
    readonly title: string;
    readonly component: BaseComponent;
    readonly inputComponent: IInputComponet;
    readonly addButton: IButton;
    readonly removeButton: IButton;
}

export class ArrayUnitComponent implements ICompositeBase, IArrayUnitComponent {

    public readonly component: BaseComponent;
    public readonly title : string;
    public readonly inputComponent : IInputComponet; //表示するInput要素のリスト
    public readonly addButton: IButton; 
    public readonly removeButton: IButton;

    /**
     * 
     * @param title CollectionUnitComponentのタイトル
     * @param inputComponent CollectionUnitComponentに表示するInputComponent
     * @param saveButton 保存ボタン
     * @param toggleFormatStateDisplay 表示形式変更ボタン
     */
    constructor(title: string, inputComponentBox: IHasInputComponent, addButton: IButton, removeButton: IButton) {
        this.title = title;
        this.component = inputComponentBox.inputComponent.component;
        this.inputComponent = inputComponentBox.inputComponent;
        this.addButton = addButton;
        this.removeButton = removeButton;
        this.initialize();
    }

    private initialize() {
        console.log(this.inputComponent);
        this.component.addCSSClass("CompositeComponent");
        // if ((this.component as unknown as IHasSquareBoard).squareBoardComponent !== undefined) {
        //     console.log("ArrayUnitComponentの初期化: スクエアボード有り");
        //     const squareBoardComponent = (this.component as unknown as IHasSquareBoard).squareBoardComponent;
        //     squareBoardComponent.addComponentToHeader(this.addButton);
        //     squareBoardComponent.addComponentToHeader(this.removeButton);
        // } 
        console.log("ArrayUnitComponentの初期化: スクエアボード無し");
        this.component.createArrowBetweenComponents(this, this.addButton);
        this.component.createArrowBetweenComponents(this, this.removeButton);
        this.addButton.component.addCSSClass(["AddButton","RayoutChangeButton"]);
        this.removeButton.component.addCSSClass(["RemoveButton","RayoutChangeButton"]);
    }

    public delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : ArrayUnitComponent {
        const inputComponentBox = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new ArrayUnitComponent(title, inputComponentBox, addButton, removeButton);
    }

    public static newWithOthre(other: IHasInputComponent) : ArrayUnitComponent {
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new ArrayUnitComponent(
            other.inputComponent.title, 
            other, 
            addButton,
            removeButton
        );
    }
}


export class ArrayUnitComponentForHasSquareBoard implements ICompositeBase,IArrayUnitComponent {

    public readonly component: BaseComponent;
    public readonly title : string;
    public readonly inputComponent : IInputComponet&IHasSquareBoard; //表示するInput要素のリスト
    public readonly addButton: IButton; 
    public readonly removeButton: IButton;

    /**
     * 
     * @param title CollectionUnitComponentのタイトル
     * @param inputComponent CollectionUnitComponentに表示するInputComponent
     * @param saveButton 保存ボタン
     * @param toggleFormatStateDisplay 表示形式変更ボタン
     */
    constructor(title: string, inputComponent: IInputComponet&IHasSquareBoard, addButton: IButton, removeButton: IButton) {
        this.title = title;
        this.component = inputComponent.component;
        this.inputComponent = inputComponent;
        this.addButton = addButton;
        this.removeButton = removeButton;
        this.initialize();
    }

    private initialize() {
        this.component.addCSSClass("CompositeComponent");
        this.inputComponent.squareBoardComponent.addComponentToHeader(this.addButton);
        this.inputComponent.squareBoardComponent.addComponentToHeader(this.removeButton);
        this.addButton.component.addCSSClass(["AddButton","RayoutChangeButton"]);
        this.removeButton.component.addCSSClass(["RemoveButton","RayoutChangeButton"]);
    }

    public delete(): void {
        this.component.delete();
    }

    public static newWithOthre(other: IInputComponet&IHasSquareBoard) : ArrayUnitComponentForHasSquareBoard {
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new ArrayUnitComponentForHasSquareBoard(
            other.title, 
            other, 
            addButton,
            removeButton
        );
    }
}