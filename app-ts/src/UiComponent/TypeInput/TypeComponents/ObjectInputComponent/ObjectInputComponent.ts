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
import "./ObjectInputComponent.css";
import { CSSProxy } from "../../../../Extend/ExtendCss";
import "../Component.css";
import { TypeComponentFactory } from "../../TypeComponentFactory";

export class ObjectInputComponent<T extends object> implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>;;
    private readonly _squareBoardComponent: SquareBoardComponent; //オブジェクトの要素を表示するためのボード
    private readonly _inputComponentDict :Record<string,IInputComponet>; //表示するInput要素の辞書
    private readonly _values: T;

    constructor(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: T) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,400,600);
        this.component = this._squareBoardComponent.component;
        this._inputComponentDict = this.createDefaultInputObject(title, schema, defaultValues);
        this._values = defaultValues;
        this.initialize();
    }

    private createDefaultInputObject(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object) : {} {
        let _inputComponentDict = {};
        for (let key in schema.shape) {
            let inputComponent = this.createDefaultInputComponent(key, schema.shape[key], defaultValues[key]);
            
            inputComponent.component.addCSSClass(["Indent","padding"]);
            _inputComponentDict[key] = inputComponent;
        }
        return _inputComponentDict;
    }

    private createDefaultInputComponent(title: string, unitSchema: z.ZodTypeAny, defaultValue:any) : IInputComponet {
        return TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
    }

    private initialize() {
        for (let key in this._inputComponentDict) {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, this._inputComponentDict[key]);
        }
        this.component.addCSSClass([
            "positionAbsolute",
        ]);
        this.setAllchildRelative();
    }

    public setTitle(title: string): void {
        this._title = title;
        this._squareBoardComponent.setTitle(title);
    }

    public onAddedToDom() {
        this.optimizeBoardSize(); //このコンポーネントがDOMに追加されたときでないと、高さが取得できないので、ここでサイズを最適化する。
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

    public getValue(): T {
        for (let key in this._inputComponentDict) {
            this._values[key] = this._inputComponentDict[key].getValue();
        }
        return this._values;
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

    public updateValue(key: string): void {
        this._values[key] = this._inputComponentDict[key].getValue();
    }

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        for (let key in this._inputComponentDict) {
            let inputComponent = this._inputComponentDict[key];
            if (inputComponent instanceof ArrayInputComponent) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponent) {
                inputComponent.optimizeBoardSize();
            }
        }

        let optimizeHeight:number = this._squareBoardComponent.getTitleHeight();
        for (let key in this._inputComponentDict) {
            let inputComponent = this._inputComponentDict[key];
            optimizeHeight += inputComponent.getHeight();
        }
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        console.log(paddingNum);
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);
       
    }

    public setAllchildRelative() {
        for (let key in this._inputComponentDict) {
            let inputComponent = this._inputComponentDict[key];
            inputComponent.component.addCSSClass("positionRelative");
            inputComponent.component.removeCSSClass("positionAbsolute");
        }
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

    public delete(): void {
        // DOM 要素を削除
        this._squareBoardComponent.delete();
        //子要素の削除
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].delete();
        }
    }

}