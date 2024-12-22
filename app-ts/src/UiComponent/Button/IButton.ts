import { BaseComponent } from "../Base/ui_component_base";
import { z } from "zod";
import { NormaButtonViewEnum } from "./NormalButton/NormalButton";

export interface IButton {
    component: BaseComponent;
    onClick(): void;
    addOnClickEvent(f: (() => void)): void;
    delete(): void;
}