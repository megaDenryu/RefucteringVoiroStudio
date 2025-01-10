import { CSSProxy } from "../../../../Extend/ExtendCss";
import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { getComponentManager, getPath, IInputComponet, notifyValueToRootParent, rootParentExecuteOptimizedBoardSize } from "../IInputComponet";
import { ObjectInputComponent } from "../ObjectInputComponent/ObjectInputComponent";
import { z } from "zod";
import { ArrayInputComponent } from "./ArrayInputComponent";
import { ArrayUnitToggleDisplaySaveButton } from "../CompositeComponent/CompositeProduct/ArrayUnitToggleDisplaySaveButton";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { ObjectInputComponentWithSaveButton } from "../ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { IRecordPathInput, RecordPath } from "../../RecordPath";
import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { IInputComponentCollection } from "../ICollectionComponent";
import { checknInterfaceType, ITypeComponent, TypeComponentInterfaceType, TypeComponentType } from "../../ComponentType";
import { IComponentManager } from "../IComponentManager";
import { IValueComponent } from "../IValueComponent";
import { get } from "http";
import { RecordInputComponent } from "../RecordInputComponent/RecordInputComponent";
import { RecordInputComponentWithSaveButton } from "../RecordInputComponent/RecordInputComponentWithSaveButton";

export class ArrayInputComponentWithSaveButton<UnitType extends z.ZodTypeAny> implements IHasComponent, IInputComponentCollection, IHasInputComponent, ITypeComponent {
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent","IInputComponentCollection","IHasInputComponent"];
    public readonly component: BaseComponent;
    private readonly _NormalButton: NormalButton
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodArray<UnitType>;
    private readonly _squareBoardComponent: SquareBoardComponent; //リストの要素を表示するためのボード
    public get squareBoardComponent(): SquareBoardComponent { return this._squareBoardComponent; }
    private readonly _inputComponentCompositeList : IHasInputComponent[]; //表示するInput要素のリスト
    public get inputComponentList(): IInputComponet[] { 
        return this._inputComponentCompositeList.map(({inputComponent}) => {
            return inputComponent;
        });
    }
    public parent: IInputComponentCollection|null = null;
    public readonly componentManager: IComponentManager|null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();

    constructor(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[], parent: IInputComponentCollection|null = null, rootParent: IComponentManager|null = null) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,600,600);
        this.component = this._squareBoardComponent.component;
        this._NormalButton = new NormalButton("リスト全体保存", "normal");
        this._inputComponentCompositeList = this.createDefaultInputComponentList(title, schema, defaultValues);
        this.parent = parent;
        this.componentManager = rootParent;
        this.initialize();
    }

    private createDefaultInputComponentList(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) : IHasInputComponent[] {
        let inputComponentList : IHasInputComponent[] = [];
        for (let i = 0; i < defaultValues.length; i++) {
            let inputComponent = this.createDefaultInputComponent(i.toString(), schema.element, defaultValues[i]);
            inputComponent.component.addCSSClass(["Indent","padding"]);
            inputComponentList.push(inputComponent);
        }
        return inputComponentList;
    }

    private createDefaultInputComponent(title:string, unitSchema: UnitType, defaultValue:UnitType["_type"]) : IHasInputComponent {
        //今は引数がUnitTypeになっているが、ここはコンポーネント生成のための関数なので、Zodにしたほうがいい。
        // return TypeComponentFactory.createDefaultInputComponentWithSaveButton(title, unitSchema, defaultValue);
        const unit = new ArrayUnitToggleDisplaySaveButton(title, unitSchema, defaultValue, this);

        //unitにイベントを追加する
        unit.arrayUnit.addButton.addOnClickEvent(() => {
            this.addElement();
        });
        unit.arrayUnit.removeButton.addOnClickEvent(() => {
            this.removeElement(this._inputComponentCompositeList.indexOf(unit));
        });
        //unitにcssを追加する
        unit.component.addCSSClass(["Indent","padding"]);
        return unit;
    }

    private initialize() {
        this._squareBoardComponent.addComponentToHeader(this._NormalButton);
        this._inputComponentCompositeList.forEach((inputComponent) => {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, inputComponent);
        });
        this.component.addCSSClass([
            "positionAbsolute",
        ]);
        this.setAllchildRelative();

        this._NormalButton.addOnClickEvent(() => {
            this.save();
            notifyValueToRootParent(this.inputComponent);
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
        this._inputComponentCompositeList.forEach(({inputComponent}) => {
            inputComponent.addOnDartyEvent(event);
        });
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._inputComponentCompositeList.forEach(({inputComponent}) => {
            inputComponent.addOnSaveEvent(event);
        });
    }

    public getValue(): UnitType["_type"][] {
        return this._inputComponentCompositeList.map(({inputComponent}) => {
            return inputComponent.getValue();
        });
    }

    public setValueWithOutSave(value: UnitType["_type"][]): void {
        this._inputComponentCompositeList.forEach(({inputComponent}, i) => {
            inputComponent.setValueWithOutSave(value[i]);
        });
    }


    /**
     * この addElement メソッドは、配列 _inputComponentList に要素を追加するためのものです。具体的には、最後の要素の値を取得し、それを新しい要素の初期値として設定して、新しい要素を作成します。
     * @param index 
     */
    public addElement(index?: number): void {
        const i = this._inputComponentCompositeList.length;
        const lastElementValue = this._inputComponentCompositeList[i - 1].inputComponent.getValue();
        let newComponent = this.createDefaultInputComponent(i.toString(), this._schema.element, lastElementValue);
        //newComponentをdaratyにする
        if (checknInterfaceType(newComponent.inputComponent, "IValueComponent")) {
            const valueComponent = newComponent.inputComponent as IValueComponent;
            valueComponent.darty.set(true);
        }
    
        if (index !== undefined && 0 <= index && index <= this._inputComponentCompositeList.length) {
            this._inputComponentCompositeList.splice(index, 0, newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent, null, index);
        } else {
            this._inputComponentCompositeList.push(newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent);
        }

        this.setAllchildRelative();
        rootParentExecuteOptimizedBoardSize(this);
    }

    /**
     * この removeElement メソッドは、配列 _inputComponentList から要素を削除するためのものです。具体的には、指定された index の位置にある要素を削除します。
     * @param index
     */
    public removeElement(index: number): void {
        if (index >= 0 && index < this._inputComponentCompositeList.length) {
            const removedComponent = this._inputComponentCompositeList.splice(index, 1);
            getComponentManager(this).オブジェクトデータの特定の子要素の配列から特定番号を削除する(getPath(removedComponent[0].inputComponent));
            removedComponent[0].delete();
            //全体の番号を振りなおす
            this._inputComponentCompositeList.forEach((unit, i) => {
                unit.inputComponent.setTitle(i.toString());
            });
        }
        rootParentExecuteOptimizedBoardSize(this);
    }

    /**
     * この moveElement メソッドは、配列 _inputComponentList 内の要素を指定された位置に移動するためのものです。具体的には、fromIndex から toIndex へ要素を移動します。
     * @param fromIndex 
     * @param toIndex 
     */
    public moveElement(fromIndex: number, toIndex: number): void {
        // インデックスが有効な範囲内にあるかをチェック
        if (0 <= fromIndex && fromIndex < this._inputComponentCompositeList.length && 0 <= toIndex && toIndex < this._inputComponentCompositeList.length) {
            // fromIndex の位置から要素を1つ取り出し、element に格納
            const element = this._inputComponentCompositeList.splice(fromIndex, 1)[0];
            // toIndex の位置に element を挿入
            this._inputComponentCompositeList.splice(toIndex, 0, element);
            // _squareBoardComponent に要素の移動を反映
            this._squareBoardComponent.moveComponent(fromIndex, toIndex);
        }
    }

    public isDarty(): boolean {

        return this._inputComponentCompositeList.some(({inputComponent}) => {
            return inputComponent.isDarty();
        });
    }

    public save(): void {
        this._inputComponentCompositeList.forEach(({inputComponent}) => {
            inputComponent.save();
        });
    }

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        this._inputComponentCompositeList.forEach(({inputComponent}) => {
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
            else {
                // console.log(`子要素 : 未対応の型です : ${inputComponent.title} : ${inputComponent.constructor.name}`);
            }
        });

        let optimizeHeight:number = this._squareBoardComponent.getTitleHeight();
        this._inputComponentCompositeList.forEach(({inputComponent}) => {
            optimizeHeight += inputComponent.getHeight();
        });
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);

        
    }

    public setAllchildRelative() {
        this._inputComponentCompositeList.forEach((inputComponent) => {
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

    public delete(): void {
        this._inputComponentCompositeList.forEach((inputComponent) => {
            inputComponent.delete();
        });
        this.component.delete();
    }

}