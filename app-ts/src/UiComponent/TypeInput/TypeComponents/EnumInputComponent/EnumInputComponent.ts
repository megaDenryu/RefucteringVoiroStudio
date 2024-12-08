
import { UnionType } from "typescript";
import { BaseComponent, ElementCreater, HtmlElementInput, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { SelecteValueInfo } from "./SelecteValueInfo";

export class EnumInputComponent implements IHasComponent, IInputComponet {

    public readonly component: BaseComponent;
    private _value: ReactiveProperty<SelecteValueInfo>;
    private _darty: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    private _save: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);

    constructor(defautValue: SelecteValueInfo) {
        this._value = new ReactiveProperty<SelecteValueInfo>(defautValue);
        let selecter:HTMLSelectElement = ElementCreater.createSelectElement(defautValue.candidate);
        let divHtml = ElementCreater.createElementFromHTMLString(`<div></div>`).appendChild(selecter);
        this.component = new BaseComponent(divHtml);
        this.initialize(selecter);
        console.log(this._value.get());
    }

    private initialize(selecter:HTMLSelectElement): void {
        selecter.addEventListener("change", () => {
            this.setValue(selecter.value);
        });
    }

    addOnChangeEvent(event: (value: SelecteValueInfo) => void): void {
        this._value.addMethod(event);
    }

    addOnDartyEvent(event: (value: boolean) => void): void {
        this._darty.addMethod(event);
    }

    addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    getValue(): SelecteValueInfo {
        return this._value.get();
    }

    save(): void {
        this._save.set(true);
    }

    setValue(value: string): void {
        let info = this._value.get();
        info.value = value;
        this._value.set(info);
        this._darty.set(true);
    }



    

}

