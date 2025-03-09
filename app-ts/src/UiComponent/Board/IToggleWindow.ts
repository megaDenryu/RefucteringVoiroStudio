import { ReactiveProperty } from "../../BaseClasses/EventDrivenCode/observer";
import { IOpenCloseWindow } from "./IOpenCloseWindow";

export interface IToggleWindow extends IOpenCloseWindow {
    toggle(): void;
    isOpenState:ReactiveProperty<boolean>
}