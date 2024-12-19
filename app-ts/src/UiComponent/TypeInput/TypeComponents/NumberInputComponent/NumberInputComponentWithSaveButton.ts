import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { BaseComponent, ElementCreater, IHasComponent } from "../../../Base/ui_component_base";
import { NormalButton } from "../../../Button/NormalButton/NormalButton";
import { ToggleFormatStateDisplay } from "../../../Display/ToggleFormatStateDisplay/ToggleFormatStateDisplay";
import { IInputComponet } from "../IInputComponet";
import { SaveState } from "../SaveState";
import "./NumberInputComponent.css";


/// <summary>
/// 数値入力コンポーネント
/// 外からこのコンポーネントに委譲できる操作
/// - 数値を取得する
/// - 数値を設定する
/// - 数値が変更されたときのイベントを登録する
/// - 数値が変更されたときのイベントを削除する
/// </summary>
export class NumberInputComponentWithSaveButton implements IHasComponent, IInputComponet {
    public readonly component: BaseComponent;
    private readonly _toggleFormatStateDisplay: ToggleFormatStateDisplay<typeof SaveState>
    private readonly _NormalButton: NormalButton
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
        this._toggleFormatStateDisplay = new ToggleFormatStateDisplay("SaveState", "保存済み", "green");
        this._NormalButton = new NormalButton("保存", "normal");
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
                class="NumberInputSlider"
            >
            <span class="NumberInputSliderValue">${this._value.get()}</span>
        </div>`;
    }

    private Initialize() {
        const NumberInputSlider = this.component.element.querySelector(".NumberInputSlider");
        
        // mousedownイベントの伝播を止める
        NumberInputSlider?.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
    
        // inputイベントのハンドリング
        NumberInputSlider?.addEventListener("input", (e) => {
            let target = e.target as HTMLInputElement;
            this._value.set(Number(target.value));
            this.component.element.querySelector(".NumberInputSliderValue")!.textContent = (this._value.get()??this._min).toString();
            this._darty.set(true);
            e.stopPropagation();
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

    public getHeight(): number {
        const h = this.component.element.getBoundingClientRect().height;
        return h;
    }

    public getWidth(): number {
        const w = this.component.element.getBoundingClientRect().width;
        return w;
    }
}