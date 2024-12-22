import { z } from "zod";
import { BaseComponent } from "../../../Base/ui_component_base";
import { IButton } from "../../../Button/IButton";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet } from "../IInputComponet";
import { SaveState } from "../SaveState";
import { IHasInputComponent } from "./ICompositeComponentList";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";


export class SaveToggleComposite2 implements IHasInputComponent {
    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    private readonly _inputComponent : IInputComponet; //表示するInput要素のリスト
    public get inputComponent(): IInputComponet { return this._inputComponent; }
    private readonly _saveButton: IButton; 
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>

    constructor(title: string, inputComponent: IInputComponet, saveButton: IButton, toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>) {
        this._title = title;
        this.component = inputComponent.component;
        this._inputComponent = inputComponent;
        this._saveButton = saveButton;
        this._toggleFormatStateDisplay = toggleFormatStateDisplay;
        this.initialize();
    }

    private initialize() {
        this.component.addCSSClass("CompositeComponent");
        this.component.createArrowBetweenComponents(this, this._saveButton);
        this.component.createArrowBetweenComponents(this, this._toggleFormatStateDisplay);
    }

    delete(): void {
        this.component.delete();
    }

    static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : SaveToggleComposite2 {
        const inputComponent = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const saveButton = new NormalButton("保存", "normal");
        const toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        return new SaveToggleComposite2(title, inputComponent, saveButton, toggleFormatStateDisplay);
    }
}