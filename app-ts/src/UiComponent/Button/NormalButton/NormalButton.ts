import { z } from "zod";
import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { inherits } from "util";
import { IButton } from "../IButton";
import "./NormalButton.css";


export const NormaButtonViewEnum = z.enum([
    "normal", "warning", "danger",
    "closeButton"
]);

export class NormalButton implements IHasComponent, IButton {
    component: BaseComponent;
    private _title: string;
    private _view: ReactiveProperty<z.infer<typeof NormaButtonViewEnum>>;
    private _onClick: (() => void)[] = [];
    
    constructor(title: string, defaultView: z.infer<typeof NormaButtonViewEnum>) {
        this._title = title;
        this._view = new ReactiveProperty(defaultView);
        let html = ElementCreater.createButtonElement(this._title, this.onClick.bind(this));
        this.component = new BaseComponent(html);
        this.initialize();
        return this;
    }

    public onClick():void {
        this._onClick.forEach(f => {
            f();
        });
    }

    private initialize() {
        this._view.addMethod((newView) => {
            const element = this.component.element;
            element.classList.remove("normal", "warning", "danger");
            element.classList.add(newView);
        });
    }

    public setView(view: z.infer<typeof NormaButtonViewEnum>): NormalButton {
        this._view.set(view);
        return this;
    }

    public addOnClickEvent(f: (() => void)): NormalButton {
        this._onClick.push(f);
        return this;
    }

    public delete(): void {
        this.component.delete();
    }
}