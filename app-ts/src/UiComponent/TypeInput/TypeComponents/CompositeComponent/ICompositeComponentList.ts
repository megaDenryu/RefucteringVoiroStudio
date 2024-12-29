import { z } from "zod";
import { IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ITypeComponent } from "../../ComponentType";

export interface IHasInputComponent extends IHasComponent, ITypeComponent {
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

