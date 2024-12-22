import { BaseComponent } from "../../../../Base/ui_component_base";
import { IInputComponet } from "../../IInputComponet";
import { ArrayUnitComponent } from "../CompositeBase/ArrayUnitComponent";
import { IHasInputComponent } from "../ICompositeComponentList";
import { SaveToggleComposite } from "./SaveToggleComposite";


export class ArrayUnitToggleDisplaySaveButton implements IHasInputComponent {
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly arrayUnit: ArrayUnitComponent;
    public readonly saveToggle: SaveToggleComposite;

    constructor(title: string, unitSchema: any, defaultValue:any) {
        this.saveToggle = SaveToggleComposite.new(title, unitSchema, defaultValue);
        this.arrayUnit = ArrayUnitComponent.newWithOthre(this.saveToggle);
        this.component = this.arrayUnit.component;
        this.inputComponent = this.arrayUnit.inputComponent;
    }

    public delete(): void {
        this.component.delete();
    }
}