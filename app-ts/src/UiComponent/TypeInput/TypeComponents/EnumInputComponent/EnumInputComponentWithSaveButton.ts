
import { UnionType } from "typescript";
import { BaseComponent, ElementCreater, HtmlElementInput, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { SelecteValueInfo } from "./SelecteValueInfo";
import "./EnumInputComponent.css";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { SaveState } from "../SaveState";

export class EnumInputComponentWithSaveButton implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>
    private readonly _NormalButton: NormalButton
    private _title: string;
    public title(): string { return this._title; }
    private readonly _value: ReactiveProperty<SelecteValueInfo>;
    private readonly _darty: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    private readonly _save: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);

    constructor(title: string, defautValue: SelecteValueInfo) {
        this._title = title;
        this._value = new ReactiveProperty<SelecteValueInfo>(defautValue);
        let selecter:HTMLSelectElement = ElementCreater.createSelectElement(defautValue.candidate);
        let divHtml = ElementCreater.createElementFromHTMLString(`
            <div class="EnumInputComponent">
                <label class="EnumInputComponentLabel">${title}</label>
            </div>
            `);
        divHtml.appendChild(selecter);
        this.component = new BaseComponent(divHtml);
        this._toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        this._NormalButton = new NormalButton("保存", "normal");
        this.initialize(selecter);
    }

    private initialize(selecter:HTMLSelectElement): void {
        selecter.addEventListener("change", () => {
            this.setValue(selecter.value);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);

        this._NormalButton.addOnClickEvent(() => {
            this.save();
        });

        this._darty.addMethod((value) => {
            if (value) {
                this._toggleFormatStateDisplay.setState("未保存");
                this._toggleFormatStateDisplay.setColor("red");
            } else {
                this._toggleFormatStateDisplay.setState("保存済み");
                this._toggleFormatStateDisplay.setColor("green");
            }
        });

        this.component.createArrowBetweenComponents(this, this._NormalButton);
        this.component.createArrowBetweenComponents(this, this._toggleFormatStateDisplay);
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

    isDarty(): boolean {
        return this._darty.get();
    }

    save(): void {
        if (this._darty.get() == true) {
            this._save.set(true);
            this._darty.set(false);
        }
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

