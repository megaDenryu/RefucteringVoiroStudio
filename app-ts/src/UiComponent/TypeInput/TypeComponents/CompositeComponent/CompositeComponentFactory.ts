import { z } from "zod";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { ArrayUnitComponent } from "./CompositeBase/ArrayUnitComponent";
import { ToggleDisplayComposite } from "./CompositeBase/ToggleDisplayComposite";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";


export class CompositeComponentFactory {
    public static newArrayToggleDispalyUnit(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) {
        
        let arrayUnit = ArrayUnitComponent.new(title, unitSchema, defaultValue);
        const toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        let toggleDisplay = new ToggleDisplayComposite(title, arrayUnit.inputComponent, toggleFormatStateDisplay);

        const ArrayToggleDispalyUnit = {
            inputComponent: arrayUnit.inputComponent,
            arrayUnit: arrayUnit,
            toggleDisplay: toggleDisplay
        } as const;

        return ArrayToggleDispalyUnit;
    }
}