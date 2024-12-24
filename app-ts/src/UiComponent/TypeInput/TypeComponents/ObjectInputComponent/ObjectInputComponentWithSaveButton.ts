import { z } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { ArrayInputComponent } from "../ArrayInputComponent/ArrayInputComponent";
import { IInputComponet } from "../IInputComponet";
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

export class ObjectInputComponentWithSaveButton implements IHasComponent, IInputComponet, IHasInputComponent, IHasSquareBoard {
    public readonly component: BaseComponent;
    private readonly _NormalButton: NormalButton
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>;;
    private readonly _squareBoardComponent: SquareBoardComponent; //オブジェクトの要素を表示するためのボード
    public get squareBoardComponent(): SquareBoardComponent { return this._squareBoardComponent; }
    private readonly _inputComponentDict :Record<string,IHasInputComponent>; //表示するInput要素の辞書
    public parent: IInputComponet | null;
    public get inputComponent(): IInputComponet { return this; }

    constructor(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object, parent: IInputComponet|null = null) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,400,600);
        this.component = this._squareBoardComponent.component;
        this._NormalButton = new NormalButton("全体保存", "normal");
        this._inputComponentDict = this.createDefaultInputObject(title, schema, defaultValues);
        this.parent = parent;
        this.initialize();
    }

    private createDefaultInputObject(title: string, schema: z.ZodObject<{ [key: string]: z.ZodTypeAny }>, defaultValues: object) : Record<string,IHasInputComponent> {
        let _inputComponentDict:Record<string,IHasInputComponent> = {};
        for (let key in schema.shape) {
            let inputComponent = this.createDefaultInputComponent(key, schema.shape[key], defaultValues[key]);
            
            inputComponent.component.addCSSClass(["Indent","padding"]);
            _inputComponentDict[key] = inputComponent;
        }
        return _inputComponentDict;
    }

    private createDefaultInputComponent(title, unitSchema: z.ZodTypeAny, defaultValue:any) : IHasInputComponent {
        return TypeComponentFactory.createInputComponentWithSaveButton2(title, unitSchema, defaultValue);
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

    public getValue(): object {
        let value = {};
        for (let key in this._inputComponentDict) {
            value[key] = this._inputComponentDict[key].inputComponent.getValue();
        }
        return value;
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
            let inputComponent = this._inputComponentDict[key];
            if (inputComponent instanceof ArrayInputComponent) {
                            inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponent) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ArrayInputComponentWithSaveButton) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponentWithSaveButton) {
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
        this._NormalButton.delete();
        for (let key in this._inputComponentDict) {
            this._inputComponentDict[key].delete();
        }

    }

}