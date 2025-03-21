import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet, notifyValueToRootParent } from "../../IInputComponet";
import { SaveState } from "../../SaveState";
import { IHasInputComponent } from "../ICompositeComponentList";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";
import { ITypeComponent, TypeComponentInterfaceType, TypeComponentType } from "../../../ComponentType";
import { IInputComponentCollection } from "../../ICollectionComponent";
import { InputTypeComponentFormat } from "../../../TypeComponentFormat/TypeComponentFormat";


export class SaveButtonComposite implements IHasInputComponent , ITypeComponent {
    public readonly componentType: TypeComponentType = "any";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasInputComponent"];
    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    private readonly _inputComponent : IInputComponet; //表示するInput要素のリスト
    public get inputComponent(): IInputComponet { return this._inputComponent; }
    private readonly _saveButton: IButton; 

    constructor(title: string, inputComponent: IInputComponet, saveButton: IButton) {
        this._title = title;
        this.component = inputComponent.component;
        this._inputComponent = inputComponent;
        this._saveButton = saveButton;
        this.initialize();
    }

    private initialize() {
        this.component.addCSSClass("CompositeComponent");
        this.component.createArrowBetweenComponents(this, this._saveButton);
        this.bindEvent();
    }

    private bindEvent() {
        this._saveButton.addOnClickEvent(() => {
            this._inputComponent.save();
            notifyValueToRootParent(this._inputComponent);
        });
    }   

    public delete(): void {
        this.component.delete();
    }

    static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, inputFormat:InputTypeComponentFormat|null, parent:IInputComponentCollection|null) : SaveButtonComposite {
        const inputComponentBox = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue, inputFormat, parent);
        const saveButton = new NormalButton("保存", "normal");
        return new SaveButtonComposite(title, inputComponentBox.inputComponent, saveButton);
    }

    static newWithOther(other: IHasInputComponent) {
        const saveButton = new NormalButton("保存", "normal");
        return new SaveButtonComposite(
            other.inputComponent.title, 
            other.inputComponent, 
            saveButton
        );
    }
}