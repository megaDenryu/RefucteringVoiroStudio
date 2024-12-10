import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { BooleanInputComponent } from "../BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "../EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "../EnumInputComponent/SelecteValueInfo";
import { IInputComponet } from "../IInputComponet";
import { NumberInputComponent } from "../NumberInputComponent/NumberInputComponent";
import { ObjectInputComponent } from "../ObjectInputComponent/ObjectInputComponent";
import { StringInputComponent } from "../StringInputComponent/StringInputComponent";
import { z } from "zod";

export class ArrayInputComponent<UnitType extends z.ZodTypeAny> implements IHasComponent, IInputComponet {


    public readonly component: BaseComponent;
    public readonly 
    private readonly _title : string;
    private readonly _schema: z.ZodArray<UnitType>;
    private readonly _squareBoardComponent: SquareBoardComponent; //リストの要素を表示するためのボード
    private readonly _inputComponentList : IInputComponet[]; //表示するInput要素のリスト

    

    constructor(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) {
        this._title = title;
        this._schema = schema;
        this.component = new BaseComponent(ElementCreater.createDivElement("ArrayInputComponent"));
        this._squareBoardComponent = new SquareBoardComponent(400,600);
        this._inputComponentList = this.createDefaultInputComponentList(title, schema, defaultValues);
        this.initialize();
    }

    private createDefaultInputComponentList(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) : IInputComponet[] {
        let inputComponentList : IInputComponet[] = [];
        for (let i = 0; i < defaultValues.length; i++) {
            let inputComponent = this.createDefaultInputComponent(title, schema.element, defaultValues[i],);
            inputComponentList.push(inputComponent);
        }
        return inputComponentList;
    }

    private createDefaultInputComponent(title, unitSchema: UnitType, defaultValue:UnitType["_type"]) : IInputComponet {
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
        this._squareBoardComponent.component.setZIndex(1);
        this._inputComponentList.forEach((inputComponent) => {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, inputComponent);
            inputComponent.component.setZIndex(2);
        });
    }


    public addOnDartyEvent(event: (value: boolean) => void): void {
        this._inputComponentList.forEach((inputComponent) => {
            inputComponent.addOnDartyEvent(event);
        });
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._inputComponentList.forEach((inputComponent) => {
            inputComponent.addOnSaveEvent(event);
        });
    }

    public getValue(): any {
        return this._inputComponentList.map((inputComponent) => {
            return inputComponent.getValue();
        });
    }

    public isDarty(): boolean {

        return this._inputComponentList.some((inputComponent) => {
            return inputComponent.isDarty();
        });
    }

    public save(): void {
        this._inputComponentList.forEach((inputComponent) => {
            inputComponent.save();
        });
    }

    public addNewElement(): void {
        let newElement = this.createDefaultInputComponent(this._title, this._schema.element, null);
        this._inputComponentList.push(newElement);
        this.component.createArrowBetweenComponents(this, newElement);
    }


}