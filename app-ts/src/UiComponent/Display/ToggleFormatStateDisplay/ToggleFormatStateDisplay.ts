import { z, ZodEnum } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/observer";
import "./ToggleFormatStateDisplay.css";

// CSSクラスを操作するためのEnumの定義
const ColorEnum = z.enum(["red", "green", "blue"]);

/**
 * 四角いボードに状態を示す文字を表示する。
 * 状態の候補はリストで持ち、外部のクラスに対して選択させる関数を提供する。
 * このコンポーネント自体はユーザーは操作できず、外部のUIを操作することでこのコンポーネントの状態を変更する。
 */
export class ToggleFormatStateDisplay<T extends ZodEnum<any>> implements IHasComponent {
    component: BaseComponent;
    private _title: string;
    private _state: ReactiveProperty<z.infer<T>>;
    private _color: ReactiveProperty<z.infer<typeof ColorEnum>>;

    constructor(title: string, defaultState: z.infer<T>, defaultColor: z.infer<typeof ColorEnum>) {
        this._title = title;
        this._state = new ReactiveProperty(defaultState);
        this._color = new ReactiveProperty(defaultColor);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition());
        this.component = new BaseComponent(html);
        this.initialize();
    }

    private HTMLDefinition(): string {
        return `
            <div class="toggle-format-state-display ${this._color.get()}">
                <div class="title">${this._title}</div>
                <div class="state">${this._state.get()}</div>
            </div>
        `;
    }

    private initialize() {
        // 初期化処理をここに追加
        this._state.addMethod((newState) => {
            const stateElement = this.component.element.querySelector('.state');
            if (stateElement) {
                stateElement.textContent = newState;
            }
        });

        this._color.addMethod((newColor) => {
            const element = this.component.element;
            element.classList.remove("red", "green", "blue");
            element.classList.add(newColor);
        });
    }

    public setState(newState: z.infer<T>) {
        this._state.set(newState);
    }

    public getState(): z.infer<T> {
        return this._state.get();
    }

    public setColor(newColor: z.infer<typeof ColorEnum>) {
        this._color.set(newColor);
    }

    public getColor(): z.infer<typeof ColorEnum> {
        return this._color.get();
    }
}


export function ToggleFormatStateDisplayの使い方(){
    // Zod Enumの定義
    const StateEnum = z.enum(["未保存", "保存済み"]);
    const AnotherStateEnum = z.enum(["開始", "終了"]);

    // ToggleFormatStateDisplayのインスタンスを作成
    const stateDisplay1 = new ToggleFormatStateDisplay<typeof StateEnum>("状態表示", "未保存", "red");
    const stateDisplay2 = new ToggleFormatStateDisplay<typeof AnotherStateEnum>("別の状態表示", "開始", "green");
    const button = document.createElement("button");

    // 状態の変更
    stateDisplay1.setState("保存済み");
    stateDisplay1.setColor("blue");

    stateDisplay2.setState("終了");
    stateDisplay2.setColor("red");

    console.log(stateDisplay1.getState()); // "保存済み"
    console.log(stateDisplay1.getColor()); // "blue"

    console.log(stateDisplay2.getState()); // "終了"
    console.log(stateDisplay2.getColor()); // "red"
}