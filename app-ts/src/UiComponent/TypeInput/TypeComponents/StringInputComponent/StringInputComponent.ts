import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponet } from "../IInputComponet";
import "./StringInputComponent.css";

export class StringInputComponent implements IHasComponent, IInputComponet, IHasInputComponent {
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    private readonly _value : ReactiveProperty<string|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : string|null;
    private _onInitialaize: Array<() => void> = [];
    public parent: IInputComponet|null = null;
    public get inputComponent(): IInputComponet { return this; }

    constructor(title: string, defaultValue: string|null, parent: IInputComponet|null = null) {
        this._title = title;
        this._defaultValue = defaultValue;
        this.parent = parent;
        console.log(defaultValue);
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
        <div class="StringInputComponent">
            <label class="StringInputComponentLabel">${this._title}</label>
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
        let element = this.component.element.querySelector(".string-input");
        this.component.element.addEventListener("mousedown", (e) => {
            this.stopPropagation(e);
        });
        element?.addEventListener("input", (e) => {
            let target = e.target as HTMLInputElement;
            this._value.set(target.value);
            this._darty.set(true);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
    }

    public setTitle(title: string): void {
        this._title = title;
        let titleContent = this.component.element.querySelector(".StringInputComponentLabel");
        if (titleContent != null) {
            titleContent.textContent = title;
        }
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

    public isDarty(): boolean {
        return this._darty.get();
    }

    public save(): void {
        if (this._darty.get() == true) {
            this._save.set(true);
            this._darty.set(false);
        }
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
    }

}