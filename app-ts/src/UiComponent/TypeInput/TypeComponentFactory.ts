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
import { IHasSquareBoard } from "../Board/IHasSquareBoard";
import { IInputComponentCollection } from "./TypeComponents/ICollectionComponent";

export class TypeComponentFactory {

    /**
     * 
     * @param title : オブジェクトでのキー名
     * @param unitSchema ： キーに対するスキーマ
     * @param defaultValue ： デフォルト値
     * @returns 
     */
    public static createDefaultInputComponent(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, parent:IInputComponentCollection|null = null) : IHasInputComponent {
        if (unitSchema instanceof z.ZodString) {
            return new StringInputComponent(title, defaultValue, parent);
        } else if (unitSchema instanceof z.ZodNumber) {
            const min = unitSchema.minValue;
            const max = unitSchema.minValue;
            const step = 1//todo: stepの取得方法が不明。unitSchema.step; では無理だった。
            return new NumberInputComponent(title, defaultValue, min , max, step, parent);
        } else if (unitSchema instanceof z.ZodBoolean) {
            return new BooleanInputComponent(title, defaultValue, parent);
        } else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponent(title, unitSchema, defaultValue, parent);
        } else if (unitSchema instanceof z.ZodEnum) {
            return new EnumInputComponent(title, new SelecteValueInfo(unitSchema.options, defaultValue as string), parent);
        } else if (unitSchema instanceof z.ZodObject) {
            return new ObjectInputComponent(title, unitSchema, defaultValue as {}, parent);
        } else if (unitSchema instanceof z.ZodOptional) {
            // ZodOptionalの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponent(title, unitSchema._def.innerType, defaultValue, parent);
        } else if (unitSchema instanceof z.ZodDefault) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.createDefaultInputComponent(title, unitSchema._def.innerType, defaultValue, parent);
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
    public static createInputComponentWithSaveButton2(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, parent:IInputComponentCollection|null = null) : IHasInputComponent {
        if (unitSchema instanceof z.ZodString) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodNumber) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodBoolean) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodArray) {
            return new ArrayInputComponentWithSaveButton(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodEnum) {
            return SaveToggleComposite.new(title, unitSchema, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodObject) {
            // return SaveToggleComposite.new(title, unitSchema, defaultValue);
            return new ObjectInputComponentWithSaveButton(title, unitSchema, defaultValue as {}, parent);
        }
        else if (unitSchema instanceof z.ZodOptional) {
            // ZodOptionalの場合、内部スキーマに対して再帰的に処理を行う
            return this.createInputComponentWithSaveButton2(title, unitSchema._def.innerType, defaultValue, parent);
        } 
        else if (unitSchema instanceof z.ZodDefault) {
            // ZodDefaultの場合、内部スキーマに対して再帰的に処理を行う
            return this.createInputComponentWithSaveButton2(title, unitSchema._def.innerType, defaultValue, parent);
        }
        throw new Error(`未対応の型です: ${unitSchema.constructor.name}`);
    }


    
}