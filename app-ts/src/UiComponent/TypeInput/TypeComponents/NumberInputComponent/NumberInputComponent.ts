import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { ReactiveProperty } from "../../../../BaseClasses/EventDrivenCode/observer";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { TypeComponentType, TypeComponentInterfaceType } from "../../ComponentType";
import { IRecordPathInput } from "../../RecordPath";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponentCollection } from "../ICollectionComponent";
import { IInputComponet } from "../IInputComponet";
import { IValueComponent } from "../IValueComponent";
import "./NumberInputComponent.css";


/// <summary>
/// 数値入力コンポーネント
/// 外からこのコンポーネントに委譲できる操作
/// - 数値を取得する
/// - 数値を設定する
/// - 数値が変更されたときのイベントを登録する
/// - 数値が変更されたときのイベントを削除する
/// </summary>
export class NumberInputComponent implements IHasComponent, IInputComponet, IHasInputComponent, IValueComponent {
    public readonly componentType: TypeComponentType = "number";    
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponet", "IHasInputComponent", "IValueComponent"];
    public readonly component: BaseComponent;
    private _title : string;
    public get title():string { return this._title; }
    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;
    public readonly value : ReactiveProperty<number|null>;
    public readonly darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : number|null;
    public parent: IInputComponentCollection|null = null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();

    constructor(title: string, defaultValue: number|null, min: number|null=null, max: number|null=null, step: number|null=null, parent: IInputComponentCollection|null = null) {
        this._title = title;
        this._min = min??0;
        this._max = max ?? 100;
        this._step = step??1;
        this._defaultValue = defaultValue;
        this.parent = parent;
        this.value = new ReactiveProperty(defaultValue);
        this.darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition(this._min, this._max, this._step));
        this.component = new BaseComponent(html);
        this.Initialize();
    }

    /// <summary>
    /// HTMLの定義を返す。
    /// スライダーのHTMLを作る。
    /// </summary>
    private HTMLDefinition(min: number, max: number, step: number): string {
        return `
        <div class="NumberInputComponent">
            <label class="NumberInputComponentLabel">${this._title}</label>
            <input 
                type="range" 
                min="${min}" 
                max="${max}" 
                step="${step}" 
                value="${this._defaultValue ?? min}"
                class="NumberInputSlider"
            >
            <span class="NumberInputSliderValue">${this.value.get()}</span>
        </div>`;
    }

    public setTitle(title: string): void {
        const labelElement = this.component.element.querySelector(".NumberInputComponentLabel");
        if (labelElement) {
            labelElement.textContent = title;
        }
    }

    private Initialize() {
        const numberInputSlider = this.component.element.querySelector(".NumberInputSlider");
        
        // mousedownイベントの伝播を止める
        numberInputSlider?.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
    
        // inputイベントのハンドリング
        numberInputSlider?.addEventListener("input", (e) => {
            let target = e.target as HTMLInputElement;
            this.value.set(Number(target.value));
            this.component.element.querySelector(".NumberInputSliderValue")!.textContent = (this.value.get()??this._min).toString();
            this.darty.set(true);
            e.stopPropagation();
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this.darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public getValue(): number|null {
        return this.value.get();
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