import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { NormalButton } from "../../../../Button/NormalButton/NormalButton";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IInputComponet } from "../../IInputComponet";
import { SaveState } from "../../SaveState";
import { IHasInputComponent } from "../ICompositeComponentList";


export class ToggleDisplayComposite implements IHasInputComponent {
    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    public readonly inputComponent: IInputComponet 
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>

    constructor(title: string, inputComponent: IInputComponet, toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>) {
        this._title = title;
        this.component = inputComponent.component;
        this.inputComponent = inputComponent;
        this._toggleFormatStateDisplay = toggleFormatStateDisplay;
        this.initialize();
    }

    private initialize() {
        this.component.addCSSClass("CompositeComponent");
        this.component.createArrowBetweenComponents(this, this._toggleFormatStateDisplay);
    }

    delete(): void {
        this.component.delete();
    }

    static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : ToggleDisplayComposite {
        const inputComponent = TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        const toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        return new ToggleDisplayComposite(title, inputComponent, toggleFormatStateDisplay);
    }

    static newWithOther(other: IHasInputComponent) {
        const toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        return new ToggleDisplayComposite(
            other.inputComponent.title(), 
            other.inputComponent, 
            toggleFormatStateDisplay
        );
    }
}