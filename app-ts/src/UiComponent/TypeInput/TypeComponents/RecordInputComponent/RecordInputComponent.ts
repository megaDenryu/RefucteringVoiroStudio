import { z } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { ArrayInputComponent } from "../ArrayInputComponent/ArrayInputComponent";
import { IInputComponet } from "../IInputComponet";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import "./RecordInputComponent.css";
import { CSSProxy } from "../../../../Extend/ExtendCss";
import "../Component.css";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { IRecordPathInput, RecordPath } from "../../RecordPath";
import { IInputComponentCollection, recusiveGetRecordPathChild } from "../ICollectionComponent";
import { TypeComponentInterfaceType, TypeComponentType } from "../../ComponentType";
import { IComponentManager } from "../IComponentManager";
import { ObjectInputComponent } from "../ObjectInputComponent/ObjectInputComponent";
import { ArrayInputComponentWithSaveButton } from "../ArrayInputComponent/ArrayInputComponentWithSaveButton";
import { ObjectInputComponentWithSaveButton } from "../ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { RecordInputComponentWithSaveButton } from "./RecordInputComponentWithSaveButton";
import { InputTypeComponentFormat, InputTypeRecord } from "../../TypeComponentFormat/TypeComponentFormat";
import { IResultBase } from "../../../../BaseClasses/ResultBase";
import { IValueComponent } from "../IValueComponent";

export class RecordInputComponent implements IHasComponent, IInputComponentCollection, IHasInputComponent {
    public readonly componentType: TypeComponentType = "record";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponentCollection", "IHasInputComponent"];
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodRecord<z.ZodTypeAny>;;
    private readonly _squareBoardComponent: SquareBoardComponent; //レコードの要素を表示するためのボード
    public get squareBoardComponent(): SquareBoardComponent { return this._squareBoardComponent; }
    private readonly _inputComponentDict :Record<string,IInputComponet>; //表示するInput要素の辞書
    public get inputComponentList(): IInputComponet[] { return Object.values(this._inputComponentDict); }
    private readonly _values: {};
    public parent: IInputComponentCollection|null = null;
    public readonly componentManager: IComponentManager|null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    public readonly inputFormat: InputTypeRecord<any>|null;

    constructor(title: string, schema: z.ZodRecord, defaultValues: {}, 
                parent: IInputComponentCollection|null, rootParent: IComponentManager|null,
                inputFormat: InputTypeRecord<any>|null = null
            ) {
        this._title = title;
        this._schema = schema;
        this.parent = parent;
        this.componentManager = rootParent;
        this.inputFormat = inputFormat;
        this._squareBoardComponent = new SquareBoardComponent(title);
        this.component = this._squareBoardComponent.component;
        this._inputComponentDict = this.createDefaultInputObject(title, schema, defaultValues);
        this._values = defaultValues;
        this.initialize();
    }

    private createDefaultInputObject(title: string, schema: z.ZodRecord<z.ZodTypeAny>, defaultValues: Record<string, any>) : {} {
        let _inputComponentDict = {};
        for (let key in defaultValues) {
            const inputFormat = this.inputFormat?.collectionType[key]??null;
            let inputComponent = this.createDefaultInputComponent(key, schema.element, defaultValues[key], inputFormat, this);
            
            inputComponent.component.addCSSClass(["Indent","padding"]);
            _inputComponentDict[key] = inputComponent;
        }
        return _inputComponentDict;
    }

    private createDefaultInputComponent(title: string, unitSchema: z.ZodTypeAny, defaultValue:any, inputFormat: InputTypeComponentFormat|null, parent: IInputComponentCollection|null) : IInputComponet {
        return TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue, inputFormat, parent).inputComponent;
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

    public getValue() {
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
            else if (inputComponent instanceof RecordInputComponent) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ArrayInputComponentWithSaveButton) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponentWithSaveButton) {
                inputComponent.optimizeBoardSize();
            } 
            else if (inputComponent instanceof RecordInputComponentWithSaveButton) {
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
        this._squareBoardComponent.changeSize("700px", optimizeHeight + paddingNum + marginNum + "px");
       
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

    public setValueWithOutSave(value: any): void {
        for (let key in this._inputComponentDict) {
            if (key in value) {
                this._inputComponentDict[key].setValueWithOutSave(value[key]);
            }
        }
    }

    public delete(): void {
        // DOM 要素を削除
        this._squareBoardComponent.delete();
        //子要素の削除
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].delete();
        }
    }
    
    public inputSimulate<T>(recordPath:RecordPath, value: T): IResultBase {
        let inputComponent:IValueComponent<T> = recusiveGetRecordPathChild(this, recordPath);
        return inputComponent.inputSimulate(value);
    }

}
