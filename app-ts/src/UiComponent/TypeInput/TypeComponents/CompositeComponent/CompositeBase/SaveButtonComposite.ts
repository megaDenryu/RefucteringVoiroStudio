import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet } from "../../IInputComponet";
import { SaveState } from "../../SaveState";
import { IHasInputComponent } from "../ICompositeComponentList";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";


export class SaveButtonComposite implements IHasInputComponent {
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
    }

    delete(): void {
        this.component.delete();
    }

    static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : SaveButtonComposite {
        const inputComponent = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const saveButton = new NormalButton("保存", "normal");
        return new SaveButtonComposite(title, inputComponent, saveButton);
    }

    static newWithOther(other: IHasInputComponent) {
        const saveButton = new NormalButton("保存", "normal");
        return new SaveButtonComposite(
            other.inputComponent.title(), 
            other.inputComponent, 
            saveButton
        );
    }
}