import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { ToggleFormatStateDisplay } from "../../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet } from "../../IInputComponet";
import { SaveState } from "../../SaveState";
import { IHasInputComponent } from "../ICompositeComponentList";
import { SaveButtonComposite } from "../CompositeBase/SaveButtonComposite";
import { ToggleDisplayComposite } from "../CompositeBase/ToggleDisplayComposite";
import { TypeComponentFactory } from "../../../TypeComponentFactory";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";

/**
 * SaveToggleComposite は、入力要素と保存ボタン、保存状態表示をまとめたコンポジットコンポーネントです。
 */
export class SaveToggleComposite implements IHasInputComponent {
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly saveButton: SaveButtonComposite;
    public readonly toggleDisplayComposite: ToggleDisplayComposite

    constructor(inputComponent: IInputComponet, saveButton: SaveButtonComposite, toggleDisplayComposite: ToggleDisplayComposite) {
        this.component = inputComponent.component;
        this.inputComponent = inputComponent;
        this.saveButton = saveButton;
        this.toggleDisplayComposite = toggleDisplayComposite;
    }

    delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, parent:(IHasSquareBoard & IInputComponet)|null) : IHasInputComponent {
        const saveButton = SaveButtonComposite.new(title, unitSchema, defaultValue, parent);
        const toggleDisplayComposite = ToggleDisplayComposite.newWithOther(saveButton);
        return new SaveToggleComposite(
            saveButton.inputComponent, 
            saveButton, 
            toggleDisplayComposite
        );
            
    }
    
    public static newWithOther(other: IHasInputComponent) {
        const saveButton = SaveButtonComposite.newWithOther(other);
        const toggleDisplayComposite = ToggleDisplayComposite.newWithOther(other);
        return new SaveToggleComposite(
            other.inputComponent, 
            saveButton, 
            toggleDisplayComposite
        );
    }


}