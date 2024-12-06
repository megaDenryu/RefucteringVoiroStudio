import { ReactiveProperty } from "../../../../BaseClasses/observer";
import { BaseComponent, IHasComponent } from "../../../Base/ui_component_base";


/// <summary>
/// 数値入力コンポーネント
/// 外からこのコンポーネントに委譲できる操作
/// - 数値を取得する
/// - 数値を設定する
/// - 数値が変更されたときのイベントを登録する
/// - 数値が変更されたときのイベントを削除する
/// </summary>
class NumberInputComponent implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly _title : string;
    private readonly _value : ReactiveProperty<number|null>;
    private readonly _darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : number|null;

    constructor(title: string, defaultValue: number|null) {
        this._title = title;
        this._defaultValue = defaultValue;
        this._value = new ReactiveProperty(defaultValue);
        this._darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        this.component = new BaseComponent();
    }

    /// <summary>
    /// htmlの定義を返す。
    /// sliderのHTMLを作る。
    /// </summary>
    private get HTMLDefinition(): string {
        return `
        <div class="number-input-component">
            <label>${this._title}</label>
            <input type="number" value="${this._value.get()}">
        </div>`;
    }

    private get CSSDefinition(): string {

    }

    
}