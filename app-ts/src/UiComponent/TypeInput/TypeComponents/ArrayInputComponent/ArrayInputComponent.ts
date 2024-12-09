import { IHasComponent, BaseComponent, HtmlElementInput, ElementCreater } from "../../../Base/ui_component_base";
import { SquareBoardComponent } from "../../../Board/SquareComponent";
import { IInputComponet } from "../IInputComponet";


class ArrayInputComponent<UnitType extends any> implements IHasComponent, IInputComponet {


    public readonly component: BaseComponent;
    public readonly 
    private readonly _title : string;
    private readonly _value : UnitType[];
    private readonly _unitType : string;
    private readonly _squareBoardComponent: SquareBoardComponent; //リストの要素を表示するためのボード
    private readonly _inputComponentList : IInputComponet[]; //表示するInput要素のリスト

    

    constructor(title: string, value: UnitType[], unitType: string) {
        this._title = title;
        this._value = value;
        this._unitType = unitType;
        this.component = new BaseComponent(ElementCreater.createDivElement("ArrayInputComponent"));
        this._inputComponentList = [this.createDefaultInputComponentList()];
        this.initialize();
    }

    private createDefaultInputComponentList() : IInputComponet {
        //UnitTypeに応じて適切なInputComponentを生成する
        if (this._unitType === "string") {

        } if (this._unitType === "number") {

        } if (this._unitType === "boolean") {

        } if (this._unitType === "enum") {

        } if (this._unitType === "object") {

        } if (this._unitType === "array") {

        }
    }

    private initialize() {

    }

    public get value() : UnitType[] {
        return this._value;
    }


}