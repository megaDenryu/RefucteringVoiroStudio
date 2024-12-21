import { z } from "zod";
import { ArrayInputComponent } from "./TypeComponents/ArrayInputComponent/ArrayInputComponent";
import { BooleanInputComponent } from "./TypeComponents/BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "./TypeComponents/EnumInputComponent/SelecteValueInfo";
import { IInputComponet } from "./TypeComponents/IInputComponet";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";
import { ObjectInputComponent } from "./TypeComponents/ObjectInputComponent/ObjectInputComponent";
import { StringInputComponent } from "./TypeComponents/StringInputComponent/StringInputComponent";
import { BooleanInputComponentWithSaveButton } from "./TypeComponents/BooleanInputComponent/BooleanInputComponentWithSaveButton";
import { EnumInputComponentWithSaveButton } from "./TypeComponents/EnumInputComponent/EnumInputComponentWithSaveButton";
import { NumberInputComponentWithSaveButton } from "./TypeComponents/NumberInputComponent/NumberInputComponentWithSaveButton";
import { ObjectInputComponentWithSaveButton } from "./TypeComponents/ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { StringInputComponentWithSaveButton } from "./TypeComponents/StringInputComponent/StringInputComponentWithSaveButton";
import { ArrayInputComponentWithSaveButton } from "./TypeComponents/ArrayInputComponent/ArrayInputComponentWithSaveButton";

export class TypeComponentFactory {

    /**
     * 
     * @param title : オブジェクトでのキー名
     * @param unitSchema ： キーに対するスキーマ
     * @param defaultValue ： デフォルト値
     * @returns 
     */
    public static createDefaultInputComponent(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : IInputComponet {
        console.log(defaultValue, unitSchema);
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
    public static createDefaultInputComponentWithSaveButton(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : IInputComponet {
        if (unitSchema instanceof z.ZodString) {
            return new StringInputComponentWithSaveButton(title, defaultValue);
        } else if (unitSchema instanceof z.ZodNumber) {
            return new NumberInputComponentWithSaveButton(title, defaultValue);
        } else if (unitSchema instanceof z.ZodBoolean) {
            return new BooleanInputComponentWithSaveButton(title, defaultValue);
        } else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponentWithSaveButton(title, unitSchema, defaultValue);
        } else if (unitSchema instanceof z.ZodEnum) {
            return new EnumInputComponentWithSaveButton(title, new SelecteValueInfo(unitSchema.options, defaultValue as string));
        } else if (unitSchema instanceof z.ZodObject) {
            return new ObjectInputComponentWithSaveButton(title, unitSchema, defaultValue as {});
        } else if (unitSchema instanceof z.ZodOptional) {
            // ZodOptionalの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponentWithSaveButton(title, unitSchema._def.innerType, defaultValue);
        } else if (unitSchema instanceof z.ZodDefault) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponentWithSaveButton(title, unitSchema._def.innerType, defaultValue);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }
}