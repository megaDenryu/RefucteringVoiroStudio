import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IInputComponet } from "../../IInputComponet";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";
import { ICompositeBase, IHasInputComponent } from "../ICompositeComponentList";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";
import { ITypeComponent, TypeComponentInterfaceType, TypeComponentType } from "../../../ComponentType";
import { IInputComponentCollection } from "../../ICollectionComponent";
import { ObjectInputComponent } from "../../ObjectInputComponent/ObjectInputComponent";
import { ArrayInputComponent } from "../../ArrayInputComponent/ArrayInputComponent";


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

export class ArrayUnitComponent implements ICompositeBase, IArrayUnitComponent, ITypeComponent {
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["ICompositeBase", "IArrayUnitComponent"];

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
        this.component.addCSSClass("CompositeComponent");
        this.component.createArrowBetweenComponents(this, this.addButton);
        this.component.createArrowBetweenComponents(this, this.removeButton);
        console.log("クリエイトアローを通った")
        this.addButton.component.addCSSClass(["AddButton","RayoutChangeButton"]);
        this.removeButton.component.addCSSClass(["RemoveButton","RayoutChangeButton"]);
    }

    public delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, parent: IInputComponentCollection) : IArrayUnitComponent {
        console.log("ArrayUnitComponent.newが呼ばれました")
        const inputComponentBox = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue, parent);
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        // ArrayInputComponentやObjectInputComponentの場合、四角形ボードが必要なので、それに合わせたコンポーネントを返す
        if (inputComponentBox instanceof ObjectInputComponent || inputComponentBox instanceof ArrayInputComponent) {
            return new ArrayUnitComponentForHasSquareBoard(title, inputComponentBox, addButton, removeButton);
        } 
        else{
            return new ArrayUnitComponent(title, inputComponentBox, addButton, removeButton);
        }
            
    }

    public static newWithOthre(other: IHasInputComponent) : ArrayUnitComponent {
        console.log("ArrayUnitComponent.newWithOthreが呼ばれました")
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
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["ICompositeBase", "IArrayUnitComponent"];
    public readonly component: BaseComponent;
    public readonly title : string;
    public readonly inputComponent : IInputComponentCollection; //表示するInput要素のリスト
    public readonly addButton: IButton; 
    public readonly removeButton: IButton;

    /**
     * 
     * @param title CollectionUnitComponentのタイトル
     * @param inputComponent CollectionUnitComponentに表示するInputComponent
     * @param saveButton 保存ボタン
     * @param toggleFormatStateDisplay 表示形式変更ボタン
     */
    constructor(title: string, inputComponent: IInputComponentCollection, addButton: IButton, removeButton: IButton) {
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

    public static newWithOthre(other: IInputComponentCollection) : ArrayUnitComponentForHasSquareBoard {
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