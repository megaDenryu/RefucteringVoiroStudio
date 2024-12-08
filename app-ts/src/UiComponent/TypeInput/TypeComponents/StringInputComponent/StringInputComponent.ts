import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";

export class StringInputComponent implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _title : string;
    private readonly _value : ReactiveProperty<string|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : string|null;
    private _onInitialaize: Array<() => void> = [];

    constructor(title: string, defaultValue: string|null) {
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
    /// 入力のHTMLを作る。
    /// </summary>
    private HTMLDefinition(): string {
        return `
        <div class="string-input-component">
            <label>${this._title}</label>
            <input 
                type="text" 
                value="${this._defaultValue ?? ''}"
                class="string-input"
            >
        </div>`;
    }

    /**
     * コールバックの初期化
     */
    private Initialize() {
        this.onInitialaize();
        console.log("StringInputComponent Initialize");
        let element = this.component.element.querySelector(".string-input");
        this.component.element.addEventListener("mousedown", (e) => {
            this.stopPropagation(e);
        });
        element?.addEventListener("input", (e) => {
            let target = e.target as HTMLInputElement;
            this._value.set(target.value);
            this._darty.set(true);
        });
    }

    private stopPropagation(e: Event) {
        e.stopPropagation();
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this._darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public addOnInitialaize(event: () => void): void {
        this._onInitialaize.push(event);
    }

    public onInitialaize(): void {
        this._onInitialaize.forEach((event) => {
            event();
        });
    }

    public getValue(): string|null {
        return this._value.get();
    }

    public save(): void {
        if (this._darty.get() == true) {
            this._save.set(true);
            this._darty.set(false);
        }
    }

}