import { z } from "zod";
import { BaseComponent } from "../../../../Base/ui_component_base";
import { IInputComponet } from "../../IInputComponet";
import { ArrayUnitComponent, ArrayUnitComponentForHasSquareBoard, IArrayUnitComponent } from "../CompositeBase/ArrayUnitComponent";
import { IHasInputComponent } from "../ICompositeComponentList";
import { SaveToggleComposite } from "./SaveToggleComposite";
import { ArrayInputComponentWithSaveButton } from "../../ArrayInputComponent/ArrayInputComponentWithSaveButton";
import { ObjectInputComponentWithSaveButton } from "../../ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { TypeComponentInterfaceType, TypeComponentType } from "../../../ComponentType";
import { IHasSquareBoard } from "../../../../Board/IHasSquareBoard";
import { IInputComponentCollection } from "../../ICollectionComponent";


export class ArrayUnitToggleDisplaySaveButton implements IHasInputComponent {
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasInputComponent"];
    public readonly component: BaseComponent;
    public readonly inputComponent: IInputComponet;
    public readonly arrayUnit: IArrayUnitComponent;
    public readonly saveToggle: IHasInputComponent;

    constructor(title: string, unitSchema: any, defaultValue:any, parent:IInputComponentCollection|null = null) {
        console.log("ArrayUnitToggleDisplaySaveButtonが呼ばれました");
        this.saveToggle = ArrayUnitToggleDisplaySaveButton.new(title, unitSchema, defaultValue, parent);
        if (this.saveToggle instanceof SaveToggleComposite) {
            this.arrayUnit = ArrayUnitComponent.newWithOthre(this.saveToggle);
        } 
        else if(this.saveToggle instanceof ArrayInputComponentWithSaveButton || this.saveToggle instanceof ObjectInputComponentWithSaveButton){
            // 配列やオブジェクトなど、四角形ボードが必要な場合
            this.arrayUnit = ArrayUnitComponentForHasSquareBoard.newWithOthre(this.saveToggle);
        }
        this.component = this.arrayUnit.component;
        this.inputComponent = this.arrayUnit.inputComponent;
    }

    public delete(): void {
        this.component.delete();
    }

    public static new(title: string, unitSchema: any, defaultValue:any, parent:IInputComponentCollection|null = null) : IHasInputComponent {
        // アレイまたはオブジェクトの時はトグルディスプレイは他とは異なるので分岐させる
        console.log("呼んでる");
        if (unitSchema instanceof z.ZodString ||
            unitSchema instanceof z.ZodNumber ||
            unitSchema instanceof z.ZodBoolean||
            unitSchema instanceof z.ZodEnum
        ) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponentWithSaveButton(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodObject) {
            return new ObjectInputComponentWithSaveButton(title, unitSchema, defaultValue as {}, parent);
        }
        else if ( unitSchema instanceof z.ZodOptional || unitSchema instanceof z.ZodDefault ) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.new(title, unitSchema._def.innerType, defaultValue);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }
}