import { z } from "zod";
import { BaseComponent, IHasComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { IToggleFormatStateDisplay } from "../../../../Display/IToggleFormatStateDisplay";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IInputComponet } from "../../IInputComponet";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";
import { ICompositeBase, IHasInputComponent } from "../ICompositeComponentList";


/**
 * CollectionUnitComponentは、ArrayInputComponentやObjectInputComponentの要素として表示されるコンポーネントです。
 * TypeInputComponentに対して様々なボタンやDisplayを追加するために使用されます。
 * 
 * ArrayUnitComponent は、ArrayInputComponentの要素として表示されるコンポーネントです。
 * ArrayInputComponent内で使用する、insertやremoveなどのボタンを提供します。
 * 
 */
export class ArrayUnitComponent implements ICompositeBase {

    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    private readonly _inputComponent : IInputComponet; //表示するInput要素のリスト
    public get inputComponent(): IInputComponet { return this._inputComponent; }
    private readonly _addButton: IButton; 
    private readonly _removeButton: IButton;

    /**
     * 
     * @param title CollectionUnitComponentのタイトル
     * @param inputComponent CollectionUnitComponentに表示するInputComponent
     * @param saveButton 保存ボタン
     * @param toggleFormatStateDisplay 表示形式変更ボタン
     */
    constructor(title: string, inputComponent: IInputComponet, addButton: IButton, removeButton: IButton) {
        this._title = title;
        this.component = inputComponent.component;
        this._inputComponent = inputComponent;
        this._addButton = addButton;
        this._removeButton = removeButton;
        this.initialize();
    }

    private initialize() {
        this.component.addCSSClass("CompositeComponent");
        this.component.createArrowBetweenComponents(this, this._addButton);
        this.component.createArrowBetweenComponents(this, this._removeButton);
    }

    public delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : ArrayUnitComponent {
        const inputComponent = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new ArrayUnitComponent(title, inputComponent, addButton, removeButton);
    }

    public static newWithOthre(other: IHasInputComponent) : ArrayUnitComponent {
        return new ArrayUnitComponent(
            other.inputComponent.title(), 
            other.inputComponent, 
            new NormalButton("追加", "normal"), 
            new NormalButton("削除", "warning")
        );
    }

    public static newWithSaveButton(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : ArrayUnitComponent {
        const inputComponent = TypeComponentFactory.createDefaultInputComponentWithSaveButton(title, unitSchema, defaultValue);
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new ArrayUnitComponent(title, inputComponent, addButton, removeButton);
    }

    


    
}