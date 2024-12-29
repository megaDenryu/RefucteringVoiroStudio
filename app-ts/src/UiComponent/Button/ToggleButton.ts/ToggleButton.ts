import { z, ZodEnum } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IButton } from "../IButton";

// 見た目のモードを定義するEnum
export enum ToggleButtonMode {
    Primary = "primary",
    Secondary = "secondary",
    Success = "success",
    Danger = "danger"
}

// トグルボタンのクラス定義
export class ToggleButton<T extends ZodEnum<any>> implements IHasComponent, IButton {
    component: BaseComponent;
    private _title: string;
    private _state: ReactiveProperty<z.infer<T>>;
    private _onClick: (() => void)[] = [];
    private _mode: ToggleButtonMode;
    
    // コンストラクタ
    constructor(title: string, defaultState: z.infer<T>, private states: T, mode: ToggleButtonMode = ToggleButtonMode.Primary) {
        this._title = title;
        this._state = new ReactiveProperty(defaultState);
        let html = ElementCreater.createButtonElement(this._title, this.onClick.bind(this));
        this._mode = mode;
        html.classList.add('toggle-button', this._mode); // CSSクラスを追加
        this.component = new BaseComponent(html);
        this.initialize();
    }

    // クリックイベントの処理
    public onClick(): void {
        this._onClick.forEach(f => {
            f();
        });
        this.toggleState();
    }

    // 初期化処理
    private initialize() {
        this._state.addMethod((newState) => {
            const element = this.component.element;
            element.textContent = `${this._title}: ${newState}`;
        });
    }

    // 状態をトグルする処理
    private toggleState() {
        const currentIndex = this.states.options.indexOf(this._state.get());
        const nextIndex = (currentIndex + 1) % this.states.options.length;
        this._state.set(this.states.options[nextIndex]);
    }

    // クリックイベントを追加するメソッド
    public addOnClickEvent(f: (() => void)): void {
        this._onClick.push(f);
    }

    // モードを切り替えるメソッド
    public setMode(mode: ToggleButtonMode): void {
        const element = this.component.element;
        element.classList.remove(this._mode);
        this._mode = mode;
        element.classList.add(this._mode);
    }

    // コンポーネントを削除するメソッド
    public delete(): void {
        this.component.delete();
    }
}
