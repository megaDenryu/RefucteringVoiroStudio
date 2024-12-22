import { z } from "zod";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { ArrayUnitComponent } from "../CompositeBase/ArrayUnitComponent";
import { ICompositeProduct, IHasInputComponent } from "../ICompositeComponentList";
import { ToggleDisplayComposite } from "../CompositeBase/ToggleDisplayComposite";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { IInputComponet } from "../../IInputComponet";
import { TypeComponentFactory } from "../../../TypeComponentFactory";


export class ArrayUnitToggleDispaly implements ICompositeProduct {
    
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly arrayUnit: ArrayUnitComponent;
    public readonly toggleDisplay: ToggleDisplayComposite;
    
    constructor(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) {
        this.toggleDisplay = ToggleDisplayComposite.new(title, unitSchema, defaultValue);
        this.arrayUnit = ArrayUnitComponent.newWithOthre(this.toggleDisplay);
        this.component = this.arrayUnit.component;
        this.inputComponent = this.arrayUnit.inputComponent;
    }

    public delete(): void {
        this.component.delete();
    }

    
}