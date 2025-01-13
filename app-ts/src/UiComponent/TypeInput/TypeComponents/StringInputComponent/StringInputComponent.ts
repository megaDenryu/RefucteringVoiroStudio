import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { ReactiveProperty } from "../../../../BaseClasses/EventDrivenCode/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { TypeComponentType, TypeComponentInterfaceType } from "../../ComponentType";
import { IRecordPathInput, RecordPath } from "../../RecordPath";
import { InputTypeComponentFormat, InputTypeString } from "../../TypeComponentFormat/TypeComponentFormat";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponentCollection } from "../ICollectionComponent";
import { IInputComponet } from "../IInputComponet";
import { IValueComponent } from "../IValueComponent";
import "./StringInputComponent.css";

export class StringInputComponent implements IHasComponent, IInputComponet, IHasInputComponent, IValueComponent {
    public readonly componentType: TypeComponentType = "string";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponet", "IHasInputComponent", "IValueComponent"];
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    public readonly value : ReactiveProperty<string|null>;
    public readonly darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : string|null;
    private _onInitialaize: Array<() => void> = [];
    public parent: IInputComponentCollection|null = null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    private _htmlInputElement : HTMLInputElement;
    public inputFormat: InputTypeString | null;

    constructor(title: string, defaultValue: string|null, parent: IInputComponentCollection|null,
                inputFormat: InputTypeString|null = null
            ) {
        this._title = title;
        this._defaultValue = defaultValue;
        this.parent = parent;
        this.inputFormat = inputFormat;
        this.value = new ReactiveProperty(defaultValue);
        this.darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition());
        this.component = new BaseComponent(html);
        this.Initialize();
        this._htmlInputElement = this.component.element.querySelector(".string-input") as HTMLInputElement
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
            this.value.set(target.value);
            this.darty.set(true);
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
        this.darty.addMethod(event);
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
        return this.value.get();
    }

    public setValueWithOutSave(value: string): void {
        if (this.darty.get() == true) { return; } // ダーティーな状態でない場合のみセットする
        this._htmlInputElement.value = value;
        this.value.setWithoutEvent(value);
    }

    public isDarty(): boolean {
        return this.darty.get();
    }

    public save(): void {
        if (this.darty.get() == true) {
            this._save.set(true);
            this.darty.set(false);
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
        this.value.clearMethods();
        this.darty.clearMethods();
        this._save.clearMethods();
    }

}