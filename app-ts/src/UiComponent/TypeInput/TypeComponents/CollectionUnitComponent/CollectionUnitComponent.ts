import { z } from "zod";
import { BaseComponent, IHasComponent } from "../../../Base/ui_component_base";
import { IButton } from "../../../Button/IButton";
import { IToggleFormatStateDisplay } from "../../../Display/IToggleFormatStateDisplay";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { IInputComponet } from "../IInputComponet";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";


/**
 * CollectionUnitComponentは、ArrayInputComponentやObjectInputComponentの要素として表示されるコンポーネントです。
 * TypeInputComponentに対して様々なボタンやDisplayを追加するために使用されます。
 * 
 */
export class CollectionUnitComponent implements IHasComponent {

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
        this.component.addCSSClass("CollectionUnitComponent");
        this.component.createArrowBetweenComponents(this, this._addButton);
        this.component.createArrowBetweenComponents(this, this._removeButton);
    }

    public delete(): void {
        this.component.delete();
    }

    static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any){
        const inputComponent = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const addButton = new NormalButton("追加", "normal");
        const removeButton = new NormalButton("削除", "warning");
        return new CollectionUnitComponent(title, inputComponent, addButton, removeButton);
    }


    
}