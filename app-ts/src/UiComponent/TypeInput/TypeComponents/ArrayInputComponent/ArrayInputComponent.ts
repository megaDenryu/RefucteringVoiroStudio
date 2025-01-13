import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { CSSProxy } from "../../../../Extend/ExtendCss";
import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { TypeComponentType, TypeComponentInterfaceType, ITypeComponent } from "../../ComponentType";
import { IRecordPathInput } from "../../RecordPath";
import { ArrayUnitComponent, IArrayUnitComponent } from "../CompositeComponent/CompositeBase/ArrayUnitComponent";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponentCollection } from "../ICollectionComponent";
import { IComponentManager } from "../IComponentManager";
import { getComponentManager, getPath, getRootParent, IInputComponet, rootParentExecuteOptimizedBoardSize } from "../IInputComponet";
import { ObjectInputComponent } from "../ObjectInputComponent/ObjectInputComponent";
import { z } from "zod";
import { RecordInputComponent } from "../RecordInputComponent/RecordInputComponent";
import { ArrayInputComponentWithSaveButton } from "./ArrayInputComponentWithSaveButton";
import { ObjectInputComponentWithSaveButton } from "../ObjectInputComponent/ObjectInputComponentWithSaveButton";
import { RecordInputComponentWithSaveButton } from "../RecordInputComponent/RecordInputComponentWithSaveButton";
import { InputTypeArray, InputTypeComponentFormat, InputTypeObject } from "../../TypeComponentFormat/TypeComponentFormat";

export class ArrayInputComponent<UnitType extends z.ZodTypeAny> implements IHasComponent, IInputComponentCollection, IHasInputComponent, ITypeComponent {
    public readonly componentType: TypeComponentType = "array";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent","IInputComponentCollection","IHasInputComponent"];
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    private readonly _schema: z.ZodArray<UnitType>;
    private readonly _squareBoardComponent: SquareBoardComponent; //リストの要素を表示するためのボード
    public get squareBoardComponent(): SquareBoardComponent { return this._squareBoardComponent; }
    private readonly _arrayUnitList : IArrayUnitComponent[]; //表示するInput要素のリスト
    public get inputComponentList(): IInputComponet[] { return this._arrayUnitList.map(({inputComponent}) => inputComponent); }
    public parent: IInputComponentCollection|null = null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    public readonly componentManager: IComponentManager|null;
    public readonly inputFormat: InputTypeArray | null;

    constructor(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[], 
                parent: IInputComponentCollection|null, rootParent: IComponentManager|null,
                inputFormat: InputTypeArray | null = null
            ) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,600,600);
        this.component = this._squareBoardComponent.component;
        this._arrayUnitList = this.createDefaultInputComponentList(title, schema, defaultValues);
        this.parent = parent;
        this.componentManager = rootParent;
        this.inputFormat = inputFormat;
        this.initialize();
    }

    private createDefaultInputComponentList(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) : IArrayUnitComponent[] {
        let inputComponentList : IArrayUnitComponent[] = [];
        for (let i = 0; i < defaultValues.length; i++) {
            const inputFormat = (this.inputFormat?.collection[i])??null;
            let inputComponent = this.createDefaultInputComponent(i.toString(), schema.element, defaultValues[i], this, inputFormat);
            inputComponent.component.addCSSClass(["Indent","padding"]);
            inputComponentList.push(inputComponent);
        }
        return inputComponentList;
    }

    private createDefaultInputComponent(title:string, unitSchema: UnitType, defaultValue:UnitType["_type"] , parent:IInputComponentCollection, inputFormat:InputTypeComponentFormat|null) : IArrayUnitComponent {
        //ArrayUnitComponentを作成するが、配列やオブジェクトなど、四角形ボードが必要な場合かどうかで分岐
        const unit:IArrayUnitComponent =  ArrayUnitComponent.new(title, unitSchema, defaultValue, parent, inputFormat);
        //unitにイベントを追加する
        unit.addButton.addOnClickEvent(() => {
            this.addElement();
        });
        unit.removeButton.addOnClickEvent(() => {
            this.removeElement(this._arrayUnitList.indexOf(unit));
        });
        //unitにcssを追加する
        unit.component.addCSSClass(["Indent","padding"]);
        return unit;
    }

    private initialize() {
        // this._squareBoardComponent.component.setZIndex(1);
        this._arrayUnitList.forEach((inputComponent) => {
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, inputComponent);
            // inputComponent.component.setZIndex(2);
        });
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
        //オブジェクトの分割代入:forEach ループの引数として { inputComponent } を使用しています。これは、各 CollectionUnitComponent オブジェクトから inputComponent プロパティを直接抽出するための分割代入です。
        this._arrayUnitList.forEach(({ inputComponent }) => {
            inputComponent.addOnDartyEvent(event);
        });
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._arrayUnitList.forEach(({inputComponent}) => {
            inputComponent.addOnSaveEvent(event);
        });
    }

    public getValue(): UnitType["_type"][] {
        return this._arrayUnitList.map(({inputComponent}) => {
            return inputComponent.getValue();
        });
    }

    public setValueWithOutSave(value: UnitType["_type"][]): void {
        this._arrayUnitList.forEach(({inputComponent}, i) => {
            inputComponent.setValueWithOutSave(value[i]);
        });
    }

    /**
     * この addElement メソッドは、配列 _inputComponentList に要素を追加するためのものです。具体的には、最後の要素の値を取得し、それを新しい要素の初期値として設定して、新しい要素を作成します。
     * @param index 
     */
    public addElement(index?: number): void {
        const i = this._arrayUnitList.length;
        const lastElementValue = this._arrayUnitList[i - 1].inputComponent.getValue();
        const inputFormat = (this.inputFormat?.collection[i])??null;
        let newComponent = this.createDefaultInputComponent(i.toString(), this._schema.element, lastElementValue, this, inputFormat);
    
        if (index !== undefined && 0 <= index && index <= this._arrayUnitList.length) {
            this._arrayUnitList.splice(index, 0, newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent, null, index);
        } else {
            this._arrayUnitList.push(newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent);
        }

        this.setAllchildRelative();
        rootParentExecuteOptimizedBoardSize(this);
    }

    /**
     * この removeElement メソッドは、配列 _inputComponentList から要素を削除するためのものです。具体的には、指定された index の位置にある要素を削除します。
     * 消したときに表示されてる番号が修正されていないので、修正する必要がある。
     * @param index
     */
    public removeElement(index: number): void {
        if (index >= 0 && index < this._arrayUnitList.length) {
            const removedComponent = this._arrayUnitList.splice(index, 1);
            getComponentManager(this).オブジェクトデータの特定の子要素の配列から特定番号を削除する(getPath(removedComponent[0].inputComponent));
            removedComponent[0].delete();
            //全体の番号を振りなおす
            this._arrayUnitList.forEach((unit, i) => {
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
        if (0 <= fromIndex && fromIndex < this._arrayUnitList.length && 0 <= toIndex && toIndex < this._arrayUnitList.length) {
            // fromIndex の位置から要素を1つ取り出し、element に格納
            const element = this._arrayUnitList.splice(fromIndex, 1)[0];
            // toIndex の位置に element を挿入
            this._arrayUnitList.splice(toIndex, 0, element);
            // _squareBoardComponent に要素の移動を反映
            this._squareBoardComponent.moveComponent(fromIndex, toIndex);
        }
    }

    public isDarty(): boolean {
        return this._arrayUnitList.some(({inputComponent}) => {
            return inputComponent.isDarty();
        });
    }

    public save(): void {
        this._arrayUnitList.forEach(({inputComponent}) => {
            inputComponent.save();
        });
    }

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        this._arrayUnitList.forEach(({inputComponent}) => {
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
        });

        let optimizeHeight:number = this._squareBoardComponent.getTitleHeight();
        this._arrayUnitList.forEach(({inputComponent}) => {
            optimizeHeight += inputComponent.getHeight();
        });
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);

    }

    public setAllchildRelative() {
        this._arrayUnitList.forEach((inputComponent) => {
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
        this._arrayUnitList.forEach((inputComponent) => {
            inputComponent.delete();
        });
        this.component.delete();
    }

}