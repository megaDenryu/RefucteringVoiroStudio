import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponet } from "../IInputComponet";
import "./BooleanInputComponent.css";


export class BooleanInputComponent implements IHasComponent, IInputComponet, IHasInputComponent {
    public readonly component: BaseComponent;
    private readonly _title : string;
    public get title():string { return this._title; }
    private readonly _value : ReactiveProperty<boolean|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : boolean|null;
    public parent: (IHasSquareBoard & IInputComponet)|null = null;
    public get inputComponent(): IInputComponet { return this; }

    constructor(title: string, defaultValue: boolean|null, parent: (IHasSquareBoard & IInputComponet)|null = null) {
        this._title = title;
        this._defaultValue = defaultValue;
        this.parent = parent;
        this._value = new ReactiveProperty(defaultValue);
        this._darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition(title));
        this.component = new BaseComponent(html);
        this.Initialize(this.component.element.querySelector(".BooleanInputCheckBox") as HTMLInputElement);
    }

       /// <summary>
    /// HTMLの定義を返す。
    /// Boolean切り替えのHTMLを作る。
    /// </summary>
    private HTMLDefinition(title:string): string {
        return `
            <div class="BooleanInputComponent">
                <label class="BooleanInputComponentLabel">
                    ${title}
                </label>
                <input class="BooleanInputCheckBox" type="checkbox">
            </div>
        `;
    }

    private Initialize(selecter: HTMLInputElement) {
        selecter.addEventListener("change", () => {
            this.setValue(selecter.checked);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
    }

    public setTitle(title: string): void {
        this.component.element.querySelector(".BooleanInputComponentLabel")!.innerHTML = title;
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
    }

    
}