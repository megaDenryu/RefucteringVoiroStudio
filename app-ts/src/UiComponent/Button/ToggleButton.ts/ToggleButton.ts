import { z, ZodEnum } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IButton } from "../IButton";

export type Action = () => void;

export interface ToggleModeInfo<State extends string> {
    state: State;
    stateViewString: string; // ボタンの文字列表示など
    CSSClass: string;
    action: Action; // 例：stateViewString = "閉じる" の時は、func = () => { this.close(); }
}

// トグルボタンのクラス定義
export class ToggleButton<State extends string> implements IHasComponent {
    component: BaseComponent;
    private _title: string;
    private _toggleModes: ToggleModeInfo<State>[];
    private _toggleModeLength: number;
    private _stateIndex: number;
    private get currentStateViewString(): string {
        return this._toggleModes[this._stateIndex].stateViewString;
    }

    constructor(title: string, toggleModes: ToggleModeInfo<State>[], defaultState: State) {
        this._title = title;
        this._toggleModes = toggleModes;
        this._toggleModeLength = toggleModes.length;
        this._stateIndex = toggleModes.findIndex(mode => mode.state === defaultState);
        let html = ElementCreater.createButtonElement(this.currentStateViewString, () => {this.onClick()});
        this.component = new BaseComponent(html);
    }

    public invokeEventByState(state: State): void {
        const index = this._toggleModes.findIndex(mode => mode.state === state);
        this.invokeEvent(index);
    }

    private invokeEvent(index: number): void {
        const prevIndex = index;
        const nextIndex = (prevIndex + 1) % this._toggleModeLength;
        this._stateIndex = nextIndex;
        this.component.element.textContent = this._toggleModes[nextIndex].stateViewString;
        this.component.addCSSClass(this._toggleModes[nextIndex].CSSClass);
        this.component.removeCSSClass(this._toggleModes[prevIndex].CSSClass);
        console.log(this._toggleModes[prevIndex].action);
        this._toggleModes[prevIndex].action();
    }
    
    private onClick(): void {
        this.invokeEvent(this._stateIndex);
    }

    // コンポーネントを削除するメソッド
    public delete(): void {
        this.component.delete();
    }
}

export type OpenCloseState = "goOpen" | "goClose";
export interface OpenCloseButtonInput {
    title: string;
    openAction: Action;
    closeAction: Action;
    defaultState: OpenCloseState;
} 
export function createOpenCloseButton(openCloseButtonInput: OpenCloseButtonInput): ToggleButton<OpenCloseState> {
    return new ToggleButton(openCloseButtonInput.title, [
        { state: "goClose", stateViewString: "閉じる", CSSClass: "goClose", action: () => { openCloseButtonInput.closeAction() } },
        { state: "goOpen", stateViewString: "開く", CSSClass: "goOpen", action: () => { openCloseButtonInput.openAction() } }
    ], openCloseButtonInput.defaultState);
}