import { CSSProxy } from "../../../../Extend/ExtendCss";
import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { BooleanInputComponent } from "../BooleanInputComponent/BooleanInputComponent";
import { EnumInputComponent } from "../EnumInputComponent/EnumInputComponent";
import { SelecteValueInfo } from "../EnumInputComponent/SelecteValueInfo";
import { IInputComponet } from "../IInputComponet";
import { NumberInputComponent } from "../NumberInputComponent/NumberInputComponent";
import { ObjectInputComponent } from "../ObjectInputComponent/ObjectInputComponent";
import { StringInputComponent } from "../StringInputComponent/StringInputComponent";
import { z } from "zod";

export class ArrayInputComponent<UnitType extends z.ZodTypeAny> implements IHasComponent, IInputComponet, IHasSquareBoard {
    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    private readonly _schema: z.ZodArray<UnitType>;
    private readonly _squareBoardComponent: SquareBoardComponent; //リストの要素を表示するためのボード
    private readonly _inputComponentList : IInputComponet[]; //表示するInput要素のリスト

    constructor(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,600,600);
        this.component = this._squareBoardComponent.component;
        this._inputComponentList = this.createDefaultInputComponentList(title, schema, defaultValues);
        this.initialize();
    }

    private createDefaultInputComponentList(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) : IInputComponet[] {
        let inputComponentList : IInputComponet[] = [];
        for (let i = 0; i < defaultValues.length; i++) {
            let inputComponent = this.createDefaultInputComponent(i.toString(), schema.element, defaultValues[i]);
            inputComponent.component.addCSSClass(["Indent","padding"]);
            inputComponentList.push(inputComponent);
        }
        return inputComponentList;
    }

    private createDefaultInputComponent(title:string, unitSchema: UnitType, defaultValue:UnitType["_type"]) : IInputComponet {
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
        // this._squareBoardComponent.component.setZIndex(1);
        this._inputComponentList.forEach((inputComponent) => {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, inputComponent);
            // inputComponent.component.setZIndex(2);
        });
        this.component.addCSSClass([
            "positionAbsolute",
        ]);
        this.setAllchildRelative();
    }

    public onAddedToDom() {
        this.optimizeBoardSize(); //このコンポーネントがDOMに追加されたときでないと、高さが取得できないので、ここでサイズを最適化する。
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

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        this._inputComponentList.forEach((inputComponent) => {
            if (inputComponent instanceof ArrayInputComponent) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponent) {
                inputComponent.optimizeBoardSize();
            }
        });

        let optimizeHeight:number = this._squareBoardComponent.getTitleHeight();
        this._inputComponentList.forEach((inputComponent) => {
            optimizeHeight += inputComponent.getHeight();
        });
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);

    }

    public setAllchildRelative() {
        this._inputComponentList.forEach((inputComponent) => {
            inputComponent.component.addCSSClass("positionRelative");
            inputComponent.component.removeCSSClass("positionAbsolute");
        });
    }

    public getHeight(): number {
        const rect = this.component.element.getBoundingClientRect();
        const style = getComputedStyle(this.component.element);
        const marginTop = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);
        const totalHeight = rect.height + marginTop + marginBottom;
        return totalHeight;
    }
    
    public getWidth(): number {
        const rect = this.component.element.getBoundingClientRect();
        const style = getComputedStyle(this.component.element);
        const marginLeft = parseFloat(style.marginLeft);
        const marginRight = parseFloat(style.marginRight);
        const totalWidth = rect.width + marginLeft + marginRight;
        return totalWidth;
    }

}