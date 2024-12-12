import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";


/// <summary>
/// 数値入力コンポーネント
/// 外からこのコンポーネントに委譲できる操作
/// - 数値を取得する
/// - 数値を設定する
/// - 数値が変更されたときのイベントを登録する
/// - 数値が変更されたときのイベントを削除する
/// </summary>
export class NumberInputComponent implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _title : string;
    public title():string { return this._title; }
    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;
    private readonly _value : ReactiveProperty<number|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : number|null;

    constructor(title: string, defaultValue: number|null, min: number = 0, max: number = 100, step: number = 1) {
        this._title = title;
        this._min = min;
        this._max = max;
        this._step = step;
        this._defaultValue = defaultValue;
        this._value = new ReactiveProperty(defaultValue);
        this._darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition(min, max, step));
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
            <label>${this._title}</label>
            <input 
                type="range" 
                min="${min}" 
                max="${max}" 
                step="${step}" 
                value="${this._defaultValue ?? min}"
                class="slider"
            >
            <span class="slider-value">${this._value.get()}</span>
        </div>`;
    }

    private Initialize() {
        const slider = this.component.element.querySelector(".slider");
        
        // mousedownイベントの伝播を止める
        slider?.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
    
        // inputイベントのハンドリング
        slider?.addEventListener("input", (e) => {
            let target = e.target as HTMLInputElement;
            this._value.set(Number(target.value));
            this.component.element.querySelector(".slider-value")!.textContent = (this._value.get()??this._min).toString();
            this._darty.set(true);
            e.stopPropagation();
        });
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this._darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public getValue(): number|null {
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