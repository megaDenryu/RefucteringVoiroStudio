import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import "./BooleanInputComponent.css";


export class BooleanInputComponent implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
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
        this.Initialize();
    }

       /// <summary>
    /// HTMLの定義を返す。
    /// Boolean切り替えのHTMLを作る。
    /// </summary>
    private HTMLDefinition(): string {
        return `
            <div class="BooleanInputComponent">
                <label class="BooleanInputComponentLabel">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
        `;
    }

    private Initialize() {
        this.component.addCSSClass([
            "positionAbsolute",
        ]);
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

    
}