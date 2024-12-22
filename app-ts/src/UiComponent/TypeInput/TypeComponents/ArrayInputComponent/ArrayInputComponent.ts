import { CSSProxy } from "../../../../Extend/ExtendCss";
import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { TypeComponentFactory } from "../../TypeComponentFactory";
import { BooleanInputComponent } from "../BooleanInputComponent/BooleanInputComponent";
import { ArrayUnitComponent } from "../CompositeComponent/CompositeBase/ArrayUnitComponent";
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
    private readonly _collectionUnitList : ArrayUnitComponent[]; //表示するInput要素のリスト

    constructor(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) {
        this._title = title;
        this._schema = schema;
        this._squareBoardComponent = new SquareBoardComponent(title,600,600);
        this.component = this._squareBoardComponent.component;
        this._collectionUnitList = this.createDefaultInputComponentList(title, schema, defaultValues);
        this.initialize();
    }

    private createDefaultInputComponentList(title: string, schema: z.ZodArray<UnitType>, defaultValues: (UnitType["_type"])[]) : ArrayUnitComponent[] {
        let inputComponentList : ArrayUnitComponent[] = [];
        for (let i = 0; i < defaultValues.length; i++) {
            let inputComponent = this.createDefaultInputComponent(i.toString(), schema.element, defaultValues[i]);
            inputComponent.component.addCSSClass(["Indent","padding"]);
            inputComponentList.push(inputComponent);
        }
        return inputComponentList;
    }

    private createDefaultInputComponent(title:string, unitSchema: UnitType, defaultValue:UnitType["_type"]) : ArrayUnitComponent {
        // return TypeComponentFactory.createDefaultInputComponent(title, unitSchema, defaultValue);
        return ArrayUnitComponent.new(title, unitSchema, defaultValue);
    }

    private initialize() {
        // this._squareBoardComponent.component.setZIndex(1);
        this._collectionUnitList.forEach((inputComponent) => {
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
        //オブジェクトの分割代入:forEach ループの引数として { inputComponent } を使用しています。これは、各 CollectionUnitComponent オブジェクトから inputComponent プロパティを直接抽出するための分割代入です。
        this._collectionUnitList.forEach(({ inputComponent }) => {
            inputComponent.addOnDartyEvent(event);
        });
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._collectionUnitList.forEach(({inputComponent}) => {
            inputComponent.addOnSaveEvent(event);
        });
    }

    public getValue(): UnitType["_type"][] {
        return this._collectionUnitList.map(({inputComponent}) => {
            return inputComponent.getValue();
        });
    }

    /**
     * この addElement メソッドは、配列 _inputComponentList に要素を追加するためのものです。具体的には、最後の要素の値を取得し、それを新しい要素の初期値として設定して、新しい要素を作成します。
     * @param index 
     */
    public addElement(index?: number): void {
        const i = this._collectionUnitList.length;
        const lastElementValue = this._collectionUnitList[i - 1].inputComponent.getValue();
        let newComponent = this.createDefaultInputComponent(i.toString(), this._schema.element, lastElementValue);
    
        if (index !== undefined && 0 <= index && index <= this._collectionUnitList.length) {
            this._collectionUnitList.splice(index, 0, newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent, null, index);
        } else {
            this._collectionUnitList.push(newComponent);
            this._squareBoardComponent.component.createArrowBetweenComponents(this._squareBoardComponent, newComponent);
        }

        this.setAllchildRelative();
        this.optimizeBoardSize();
    }

    /**
     * この removeElement メソッドは、配列 _inputComponentList から要素を削除するためのものです。具体的には、指定された index の位置にある要素を削除します。
     * @param index
     */
    public removeElement(index: number): void {
        if (index >= 0 && index < this._collectionUnitList.length) {
            const removedComponent = this._collectionUnitList.splice(index, 1);
            removedComponent[0].delete();
        }
    }

    /**
     * この moveElement メソッドは、配列 _inputComponentList 内の要素を指定された位置に移動するためのものです。具体的には、fromIndex から toIndex へ要素を移動します。
     * @param fromIndex 
     * @param toIndex 
     */
    public moveElement(fromIndex: number, toIndex: number): void {
        // インデックスが有効な範囲内にあるかをチェック
        if (0 <= fromIndex && fromIndex < this._collectionUnitList.length && 0 <= toIndex && toIndex < this._collectionUnitList.length) {
            // fromIndex の位置から要素を1つ取り出し、element に格納
            const element = this._collectionUnitList.splice(fromIndex, 1)[0];
            // toIndex の位置に element を挿入
            this._collectionUnitList.splice(toIndex, 0, element);
            // _squareBoardComponent に要素の移動を反映
            this._squareBoardComponent.moveComponent(fromIndex, toIndex);
        }
    }

    public isDarty(): boolean {

        return this._collectionUnitList.some(({inputComponent}) => {
            return inputComponent.isDarty();
        });
    }

    public save(): void {
        this._collectionUnitList.forEach(({inputComponent}) => {
            inputComponent.save();
        });
    }

    public addNewElement(): void {
        let newElement = this.createDefaultInputComponent(this._title, this._schema.element, null);
        this._collectionUnitList.push(newElement);
        this.component.createArrowBetweenComponents(this, newElement);
    }

    public optimizeBoardSize(): void {
        //子コンポーネントがIHassSquareBoardを実装している場合、先に子コンポーネントのサイズを最適化する。
        this._collectionUnitList.forEach(({inputComponent}) => {
            if (inputComponent instanceof ArrayInputComponent) {
                inputComponent.optimizeBoardSize();
            }
            else if (inputComponent instanceof ObjectInputComponent) {
                inputComponent.optimizeBoardSize();
            }
        });

        let optimizeHeight:number = this._squareBoardComponent.getTitleHeight();
        this._collectionUnitList.forEach(({inputComponent}) => {
            optimizeHeight += inputComponent.getHeight();
        });
        const paddingNum = CSSProxy.getClassStyleProperty("padding", "padding")?.toNum("px")??0;
        const marginNum = CSSProxy.getClassStyleProperty("margin", "margin")?.toNum("px")??0;
        this._squareBoardComponent.changeSize(700, optimizeHeight + paddingNum + marginNum);

    }

    public setAllchildRelative() {
        this._collectionUnitList.forEach((inputComponent) => {
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
        this._collectionUnitList.forEach((inputComponent) => {
            inputComponent.delete();
        });
        this.component.delete();
    }

}