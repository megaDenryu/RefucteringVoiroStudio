import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet } from "../IInputComponet";
import { SaveState } from "../SaveState";
import "./BooleanInputComponent.css";


export class BooleanInputComponentWithToggleDisplay implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>
    private readonly _title : string;
    public title():string { return this._title; }
    private readonly _value : ReactiveProperty<boolean|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : boolean|null;

    constructor(title: string, defaultValue: boolean|null) {
        this._title = title;
        this._defaultValue = defaultValue;
        this._value = new ReactiveProperty(defaultValue);
        this._darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition());
        this.component = new BaseComponent(html);
        this._toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        this.Initialize(this.component.element.querySelector(".BooleanInputCheckBox") as HTMLInputElement);
    }

       /// <summary>
    /// HTMLの定義を返す。
    /// Boolean切り替えのHTMLを作る。
    /// </summary>
    private HTMLDefinition(): string {
        return `
            <div class="BooleanInputComponent">
                <label class="BooleanInputComponentLabel">
                    <input class="BooleanInputCheckBox" type="checkbox">
                </label>
            </div>
        `;
    }

    private Initialize(selecter: HTMLInputElement): void {
        selecter.addEventListener("change", () => {
            this.setValue(selecter.checked);
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

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this._darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public getValue(): boolean|null {
        return this._value.get();
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

    public setValue(value: boolean): void {
        this._value.set(value);
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