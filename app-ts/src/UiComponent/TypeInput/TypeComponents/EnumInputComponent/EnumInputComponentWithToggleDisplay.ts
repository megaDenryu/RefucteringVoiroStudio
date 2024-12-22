
import { UnionType } from "typescript";
import { BaseComponent, ElementCreater, HtmlElementInput, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { SelecteValueInfo } from "./SelecteValueInfo";
import "./EnumInputComponent.css";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { SaveState } from "../SaveState";

export class EnumInputComponentWithToggleDisplay implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>
    private _title: string;
    public title(): string { return this._title; }
    private readonly _value: ReactiveProperty<SelecteValueInfo>;
    private readonly _darty: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    private readonly _save: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);

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
        this._toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        this.initialize(selecter);
    }

    private initialize(selecter:HTMLSelectElement): void {
        selecter.addEventListener("change", () => {
            this.setValue(selecter.value);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);

        this._darty.addMethod((value) => {
            if (value) {
                this._toggleFormatStateDisplay.setState("未保存");
                this._toggleFormatStateDisplay.setColor("red");
            } else {
                this._toggleFormatStateDisplay.setState("保存済み");
                this._toggleFormatStateDisplay.setColor("green");
            }
        });

        this.component.createArrowBetweenComponents(this, this._toggleFormatStateDisplay);
    }

    public addOnChangeEvent(event: (value: SelecteValueInfo) => void): void {
        this._value.addMethod(event);
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this._darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public getValue(): string {
        return this._value.get().value;
    }

    public isDarty(): boolean {
        return this._darty.get();
    }

    public save(): void {
        if (this._darty.get() == true) {
            this._save.set(true);
            this._darty.set(false);
        }
    }

    public setValue(value: string): void {
        let info = this._value.get();
        info.value = value;
        this._value.set(info);
        this._darty.set(true);
    }

    public getHeight(): number {
        const h = this.component.element.getBoundingClientRect().height;
        return h;
    }

    public getWidth(): number {
        const w = this.component.element.getBoundingClientRect().width;
        return w;
    }

    public delete(): void {
        // DOM 要素を削除
        this.component.delete();
        // ReactiveProperty インスタンスのクリーンアップ
        this._value.clearMethods();
        this._darty.clearMethods();
        this._save.clearMethods();
        //子要素の削除
        this._toggleFormatStateDisplay.delete();
    }
}

