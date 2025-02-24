import { BaseComponent } from "../Base/ui_component_base";

export interface IButton {
    component: BaseComponent;
    onClick(): void;
    addOnClickEvent(f: (() => void)): void;
    delete(): void;
}