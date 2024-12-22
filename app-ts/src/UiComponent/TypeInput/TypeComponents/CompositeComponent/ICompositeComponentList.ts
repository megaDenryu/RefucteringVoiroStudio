import { z } from "zod";
import { IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";

export interface IHasInputComponent extends IHasComponent {
    inputComponent: IInputComponet;
}

export interface ICompositeBase extends IHasInputComponent {
    delete(): void;
    // static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any): ICompositeBase;
    // static newWithOthre(other: IHasInputComponent): ICompositeBase;
}

export interface ICompositeProduct extends IHasInputComponent {
    delete(): void;
    // static new(title: string, unitSchema: z.ZodTypeAny, defaultValue:any): ICompositeBase;
    // static newWithOthre(other: IHasInputComponent): ICompositeBase;
}

