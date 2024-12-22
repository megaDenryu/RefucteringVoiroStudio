
import { z, ZodEnum } from "zod";
import { BaseComponent } from "../Base/ui_component_base";
import { ColorEnum } from "./ToggleFormatStateDisplay/ToggleFormatStateDisplay";

export interface IToggleFormatStateDisplay<T extends ZodEnum<any>> {
    component: BaseComponent;
    setState(newState: z.infer<T>): void;
    getState(): z.infer<T>;
    setColor(newColor: z.infer<typeof ColorEnum>): void;
    getColor(): z.infer<typeof ColorEnum>;
    delete(): void;
}