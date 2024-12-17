import { z } from "zod";
import { BaseComponent, ElementCreater } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/observer";
import { inherits } from "util";


export const NormaButtonViewEnum = z.enum(["normal", "warning", "danger"]);

class NormaButton {
    component: BaseComponent;
    private _title: string;
    private _view: ReactiveProperty<z.infer<typeof NormaButtonViewEnum>>;
    private _onClick: (() => void)[];
    
    constructor(title: string, defaultView: z.infer<typeof NormaButtonViewEnum>) {
        this._title = title;
        this._view = new ReactiveProperty(defaultView);
        let html = ElementCreater.createButtonElement("normal", this.onClick);
        this.component = new BaseComponent(html);
        this.initialize();
    }

    private onClick():void {
        this._onClick.forEach((f) => {
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
}