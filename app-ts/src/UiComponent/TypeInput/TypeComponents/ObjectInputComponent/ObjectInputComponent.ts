import { z } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { ArrayInputComponent } from "../ArrayInputComponent/ArrayInputComponent";
import { BooleanInputComponent } from "../BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "../EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "../EnumInputComponent/SelecteValueInfo";
import { IInputComponet } from "../IInputComponet";
import { NumberInputComponent } from "../NumberInputComponent/NumberInputComponent";
import { StringInputComponent } from "../StringInputComponent/StringInputComponent";
import { SquareBoardComponent } from "../../../Board/SquareComponent";

export class ObjectInputComponent implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _title : string;
    private readonly _schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>;;
    private readonly _squareBoardComponent: SquareBoardComponent; //オブジェクトの要素を表示するためのボード
    private readonly _inputComponentDict : {}; //表示するInput要素の辞書

    constructor(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object) {
        this._title = title;
        this._schema = schema;
        this.component = new BaseComponent(ElementCreater.createDivElement("ObjectInputComponent"));
        this._squareBoardComponent = new SquareBoardComponent(400,600);
        this._inputComponentDict = this.createDefaultInputObject(title, schema, defaultValues);
        this.initialize();
    }

    private createDefaultInputObject(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object) : {} {
        let _inputComponentDict = {};
        for (let key in schema.shape) {
            let inputComponent = this.createDefaultInputComponent(key, schema.shape[key], defaultValues[key]);
            _inputComponentDict[key] = inputComponent;
        }
        return _inputComponentDict;
    }

    private createDefaultInputComponent(title, unitSchema: z.ZodTypeAny, defaultValue:any) : IInputComponet {
        //今は引数がUnitTypeになっているが、ここはコンポーネント生成のための関数なので、Zodにしたほうがいい。
            
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
        }
        throw new Error("未対応の型です。");
    }

    private initialize() {
        this.component.createArrowBetweenComponents(this, this._squareBoardComponent);
        for (let key in this._inputComponentDict) {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, this._inputComponentDict[key]);
        }
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].addOnDartyEvent(event);
        }
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].addOnSaveEvent(event);
        }
    }

    public getValue(): object {
        let value = {};
        for (let key in this._inputComponentDict) {
            value[key] = this._inputComponentDict[key].getValue();
        }
        return value;
    }

    public isDarty(): boolean {
        for (let key in this._inputComponentDict) {
            if (this._inputComponentDict[key].isDarty()) {
                return true;
            }
        }
        return false;
    }

    public save(): void {
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].save();
        }
    }
}