import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IInputComponet } from "../../IInputComponet";
import { ArrayUnitComponent } from "../CompositeBase/ArrayUnitComponent";
import { IHasInputComponent } from "../ICompositeComponentList";
import { SaveToggleComposite } from "./SaveToggleComposite";
import { ArrayInputComponentWithSaveButton } from "../../ArrayInputComponent/ArrayInputComponentWithSaveButton";
import { ObjectInputComponentWithSaveButton } from "../../ObjectInputComponent/ObjectInputComponentWithSaveButton";


export class ArrayUnitToggleDisplaySaveButton implements IHasInputComponent {
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly arrayUnit: ArrayUnitComponent;
    public readonly saveToggle: IHasInputComponent;

    constructor(title: string, unitSchema: any, defaultValue:any) {
        this.saveToggle = ArrayUnitToggleDisplaySaveButton.new(title, unitSchema, defaultValue);
        this.arrayUnit = ArrayUnitComponent.newWithOthre(this.saveToggle); //ここでアレイとオブジェクトにも付けているが、対応していないのでエラーになる
        this.component = this.arrayUnit.component;
        this.inputComponent = this.arrayUnit.inputComponent;
    }

    public delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: any, defaultValue:any) {
        // アレイまたはオブジェクトの時はトグルディスプレイは他とは異なるので分岐させる
        console.log("呼んでる");
        if (unitSchema instanceof z.ZodString ||
            unitSchema instanceof z.ZodNumber ||
            unitSchema instanceof z.ZodBoolean||
            unitSchema instanceof z.ZodEnum
        ) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponentWithSaveButton(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodObject) {
            return new ObjectInputComponentWithSaveButton(title, unitSchema, defaultValue as {});
        }
        else if ( unitSchema instanceof z.ZodOptional || unitSchema instanceof z.ZodDefault ) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.new(title, unitSchema._def.innerType, defaultValue);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }
}