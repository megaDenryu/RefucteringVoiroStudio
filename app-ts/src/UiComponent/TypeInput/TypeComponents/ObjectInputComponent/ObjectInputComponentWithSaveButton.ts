import { z } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { ArrayInputComponent } from "../ArrayInputComponent/ArrayInputComponent";
import { IInputComponet, notifyValueToRootParent, notifyValueToRootParentFromComponentCollection } from "../IInputComponet";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import "./ObjectInputComponent.css";
import { CSSProxy } from "../../../../Extend/ExtendCss";
import "../Component.css";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { ArrayInputComponentWithSaveButton } from "../ArrayInputComponent/ArrayInputComponentWithSaveButton";
import { ObjectInputComponent } from "./ObjectInputComponent";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { IRecordPathInput, RecordPath } from "../../RecordPath";
import { IInputComponentCollection, recusiveGetRecordPathChild } from "../ICollectionComponent";
import { TypeComponentInterfaceType, TypeComponentType } from "../../ComponentType";
import { IComponentManager } from "../IComponentManager";
import { RecordInputComponentWithSaveButton } from "../RecordInputComponent/RecordInputComponentWithSaveButton";
import { RecordInputComponent } from "../RecordInputComponent/RecordInputComponent";
import { InputTypeComponentFormat, InputTypeObject } from "../../TypeComponentFormat/TypeComponentFormat";
import { IResultBase } from "../../../../BaseClasses/ResultBase";
import { IValueComponent } from "../IValueComponent";

export class ObjectInputComponentWithSaveButton<T extends object> implements IHasComponent, IInputComponentCollection, IHasInputComponent {
    public readonly componentType: TypeComponentType = "object";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponentCollection", "IHasInputComponent"];
    public readonly component: BaseComponent;
    private readonly _NormalButton: NormalButton
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>;;
    private readonly _squareBoardComponent: SquareBoardComponent; //オブジェクトの要素を表示するためのボード
    public get squareBoardComponent(): SquareBoardComponent { return this._squareBoardComponent; }
    private readonly _inputComponentDict :Record<string,IHasInputComponent>; //表示するInput要素の辞書
    public get inputComponentList(): IInputComponet[] { 
        return Object.values(this._inputComponentDict).map((inputComponent) => {
            return inputComponent.inputComponent;
        });
    }
    private readonly _values: T;
    public parent: IInputComponentCollection | null;
    public readonly componentManager: IComponentManager|null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    public readonly inputFormat: InputTypeObject|null;

    constructor(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: T, 
                parent: IInputComponentCollection|null, rootParent: IComponentManager|null,
                inputFormat: InputTypeObject|null
            ) {
        this._title = title;
        this._schema = schema;
        this._values = defaultValues;
        this._squareBoardComponent = new SquareBoardComponent(title,400,600);
        this.inputFormat = inputFormat;
        this.component = this._squareBoardComponent.component;
        this._NormalButton = new NormalButton("全体保存", "normal");
        this._inputComponentDict = this.createDefaultInputObject(title, schema, defaultValues);
        this.parent = parent;
        this.componentManager = rootParent;
        this.initialize();
    }

    private createDefaultInputObject(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object) : Record<string,IHasInputComponent> {
        let _inputComponentDict:Record<string,IHasInputComponent> = {};
        for (let key in schema.shape) {
            if (defaultValues[key] === undefined) {
                console.error("defaultValuesにkeyが存在しません。key:", key, defaultValues);
            }
            const inputFormat = (this.inputFormat?.collectionType[key])??null;
            console.log(key + "のinputFormat：", inputFormat);
            let inputComponent = this.createDefaultInputComponent(key, schema.shape[key], defaultValues[key], inputFormat, this);
            
            inputComponent.component.addCSSClass(["Indent","padding"]);
            _inputComponentDict[key] = inputComponent;
        }
        return _inputComponentDict;
    }

    private createDefaultInputComponent(title, unitSchema: z.ZodTypeAny, defaultValue:any, inputFormat: InputTypeComponentFormat|null, parent: IInputComponentCollection|null) : IHasInputComponent {
        return TypeComponentFactory.createInputComponentWithSaveButton2(title, unitSchema, defaultValue, inputFormat, parent);
        // return SaveToggleComposite.new(title, unitSchema, defaultValue);
    }

    private initialize() {
        this._squareBoardComponent.addComponentToHeader(this._NormalButton);
        for (let key in this._inputComponentDict) {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, this._inputComponentDict[key]);
        }
        this.component.addCSSClass([
            "positionAbsolute",
        ]);
        this.setAllchildRelative();

        this._NormalButton.addOnClickEvent(() => {
            this.save();
            notifyValueToRootParentFromComponentCollection(this);
        });

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
            this._inputComponentDict[key].inputComponent.addOnDartyEvent(event);
        }
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].inputComponent.addOnSaveEvent(event);
        }
    }

    public getValue(): T {
        for (let key in this._inputComponentDict) {
            const v = this._inputComponentDict[key].inputComponent.getValue();
            console.log(v);
            this._values[key] = v;

        }
        return this._values;
    }

    public setValueWithOutSave(value: T): void {
        for (let key in this._inputComponentDict) {
            if (value[key] !== undefined) {
                this._inputComponentDict[key].inputComponent.setValueWithOutSave(value[key]);
            }
        }
    }

    public isDarty(): boolean {
        for (let key in this._inputComponentDict) {
            if (this._inputComponentDict[key].inputComponent.isDarty()) {
                return true;
            }
        }
        return false;
    }

    public save(): void {
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].inputComponent.save();
        }
    }

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        for (let key in this._inputComponentDict) {
            let inputComponent = this._inputComponentDict[key].inputComponent;
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
            let inputComponentBox = this._inputComponentDict[key];
            optimizeHeight += inputComponentBox.inputComponent.getHeight();
        }
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);
       
    }

    public setAllchildRelative() {
        for (let key in this._inputComponentDict) {
            let inputComponent = this._inputComponentDict[key];
            inputComponent.component.setAsChildComponent();
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
        this._NormalButton.delete();
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].delete();
        }

    }

    public inputSimulate<T>(recordPath:RecordPath, value: T): IResultBase {
        let inputComponent:IValueComponent<T> = recusiveGetRecordPathChild(this, recordPath);
        return inputComponent.inputSimulate(value);
    }
}