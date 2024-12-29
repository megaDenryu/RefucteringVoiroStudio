import { z, ZodEnum } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import "./ToggleFormatStateDisplay.css";
import { IToggleFormatStateDisplay } from "../IToggleFormatStateDisplay";

// CSSクラスを操作するためのEnumの定義
export const ColorEnum = z.enum(["red", "green", "blue"]);

/**
 * 四角いボードに状態を示す文字を表示する。
 * 状態の候補はリストで持ち、外部のクラスに対して選択させる関数を提供する。
 * このコンポーネント自体はユーザーは操作できず、外部のUIを操作することでこのコンポーネントの状態を変更する。
 */
export class ToggleFormatStateDisplay<T extends ZodEnum<any>> implements IHasComponent, IToggleFormatStateDisplay<T> {
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

    public delete(): void {
        this.component.delete();
    }
}


export function ToggleFormatStateDisplayの使い方() {
    // Zod Enumの定義
    const StateEnum = z.enum(["未保存", "保存済み"]);

    // ToggleFormatStateDisplayのインスタンスを作成
    const stateDisplay = new ToggleFormatStateDisplay<typeof StateEnum>("状態表示", "未保存", "red");

    // ボタンを生成
    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.onclick = () => {
        stateDisplay.setState("保存済み");
        stateDisplay.setColor("green");
    };

    const unsaveButton = document.createElement("button");
    unsaveButton.textContent = "未保存";
    unsaveButton.onclick = () => {
        stateDisplay.setState("未保存");
        stateDisplay.setColor("red");
    };

    // DOMに追加
    document.body.appendChild(stateDisplay.component.element);
    document.body.appendChild(saveButton);
    document.body.appendChild(unsaveButton);
}