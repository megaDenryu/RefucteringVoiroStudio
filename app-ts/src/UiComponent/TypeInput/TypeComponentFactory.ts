import { z } from "zod";
import { ArrayInputComponent } from "./TypeComponents/ArrayInputComponent/ArrayInputComponent";
import { BooleanInputComponent } from "./TypeComponents/BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "./TypeComponents/EnumInputComponent/SelecteValueInfo";
import { IInputComponet } from "./TypeComponents/IInputComponet";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";
import { ObjectInputComponent } from "./TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { StringInputComponent } from "./TypeComponents/StringInputComponent/StringInputComponent";
import { ObjectInputComponentWithSaveButton } from "./TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { ArrayInputComponentWithSaveButton } from "./TypeComponents/ArrayInputComponent/ArrayInputComponentWithSaveButton";
import { IHasInputComponent } from "./TypeComponents/CompositeComponent/ICompositeComponentList";
import { SaveButtonComposite } from "./TypeComponents/CompositeComponent/CompositeBase/SaveButtonComposite";
import { SaveToggleComposite } from "./TypeComponents/CompositeComponent/CompositeProduct/SaveToggleComposite";
import { ArrayUnitToggleDisplaySaveButton } from "./TypeComponents/CompositeComponent/CompositeProduct/ArrayUnitToggleDisplaySaveButton";

export class TypeComponentFactory {

    /**
     * 
     * @param title : オブジェクトでのキー名
     * @param unitSchema ： キーに対するスキーマ
     * @param defaultValue ： デフォルト値
     * @returns 
     */
    public static createDefaultInputComponent(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : IHasInputComponent {
        if (unitSchema instanceof z.ZodString) {
            return new StringInputComponent(title, defaultValue);
        } else if (unitSchema instanceof z.ZodNumber) {
            return new NumberInputComponent(title, defaultValue);
        } else if (unitSchema instanceof z.ZodBoolean) {
            return new BooleanInputComponent(title, defaultValue);
        } else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponent(title, unitSchema, defaultValue);
        } else if (unitSchema instanceof z.ZodEnum) {
            return new EnumInputComponent(title, new SelecteValueInfo(unitSchema.options, defaultValue as string));
        } else if (unitSchema instanceof z.ZodObject) {
            return new ObjectInputComponent(title, unitSchema, defaultValue as {});
        } else if (unitSchema instanceof z.ZodOptional) {
            // ZodOptionalの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponent(title, unitSchema._def.innerType, defaultValue);
        } else if (unitSchema instanceof z.ZodDefault) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponent(title, unitSchema._def.innerType, defaultValue);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }

    /**
     * 
     * @param title : オブジェクトでのキー名
     * @param unitSchema ： キーに対するスキーマ
     * @param defaultValue ： デフォルト値
     * @returns 
     */
    public static createInputComponentWithSaveButton2(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : IHasInputComponent {
        if (unitSchema instanceof z.ZodString) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodNumber) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodBoolean) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponentWithSaveButton(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodEnum) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodObject) {
            // return SaveToggleComposite.new(title, unitSchema, defaultValue);
            return new ObjectInputComponentWithSaveButton(title, unitSchema, defaultValue as {});
        }
        else if (unitSchema instanceof z.ZodOptional) {
            // ZodOptionalの場合、内部スキーマに対して再帰的に処理を行う
            return this.createInputComponentWithSaveButton2(title, unitSchema._def.innerType, defaultValue);
        } 
        else if (unitSchema instanceof z.ZodDefault) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.createInputComponentWithSaveButton2(title, unitSchema._def.innerType, defaultValue);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }


    
}