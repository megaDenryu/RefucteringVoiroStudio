import { z } from "zod";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { ArrayUnitComponent } from "../CompositeBase/ArrayUnitComponent";
import { ICompositeProduct, IHasInputComponent } from "../ICompositeComponentList";
import { ToggleDisplayComposite } from "../CompositeBase/ToggleDisplayComposite";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IButton } from "../../../../Button/IButton";
import { IInputComponet } from "../../IInputComponet";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";
import { ITypeComponent, TypeComponentType, TypeComponentInterfaceType } from "../../../ComponentType";


export class ArrayUnitToggleDispaly implements ICompositeProduct, ITypeComponent {
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["ICompositeProduct"];
    
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly arrayUnit: ArrayUnitComponent;
    public readonly toggleDisplay: ToggleDisplayComposite;
    
    constructor(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, parent: (IHasSquareBoard & IInputComponet)|null = null) {
        this.toggleDisplay = ToggleDisplayComposite.new(title, unitSchema, defaultValue, parent);
        this.arrayUnit = ArrayUnitComponent.newWithOthre(this.toggleDisplay);
        this.component = this.arrayUnit.component;
        this.inputComponent = this.arrayUnit.inputComponent;
    }

    public delete(): void {
        this.component.delete();
    }

    
}