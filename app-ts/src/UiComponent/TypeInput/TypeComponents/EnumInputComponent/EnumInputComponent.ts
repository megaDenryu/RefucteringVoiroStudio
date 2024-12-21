
import { UnionType } from "typescript";
import { BaseComponent, ElementCreater, HtmlElementInput, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { SelecteValueInfo } from "./SelecteValueInfo";
import "./EnumInputComponent.css";

export class EnumInputComponent implements IHasComponent, IInputComponet {

    public readonly component: BaseComponent;
    private _title: string;
    public title(): string { return this._title; }
    private _value: ReactiveProperty<SelecteValueInfo>;
    private _darty: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    private _save: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);

    constructor(title: string, defautValue: SelecteValueInfo) {
        this._title = title;
        this._value = new ReactiveProperty<SelecteValueInfo>(defautValue);
        let selecter:HTMLSelectElement = ElementCreater.createSelectElement(defautValue.candidate, null, defautValue.value);
        let divHtml = ElementCreater.createElementFromHTMLString(`
            <div class="EnumInputComponent">
                <label class="EnumInputComponentLabel">${title}</label>
            </div>
            `);
        divHtml.appendChild(selecter);
        this.component = new BaseComponent(divHtml);
        this.initialize(selecter);
    }

    private initialize(selecter:HTMLSelectElement): void {
        selecter.addEventListener("change", () => {
            console.log("change",selecter.value);
            this.setValue(selecter.value);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
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

    getValue(): string {
        return this._value.get().value;
    }

    isDarty(): boolean {
        return this._darty.get();
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

    getHeight(): number {
        const h = this.component.element.getBoundingClientRect().height;
        return h;
    }

    getWidth(): number {
        const w = this.component.element.getBoundingClientRect().width;
        return w;
    }
}

