import { BaseComponent, ElementCreater, IHasComponent } from "../../Base/ui_component_base";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IButton } from "../IButton";
import { VanillaExtractClassName } from "../../../Extend/VanilaExtractExtend.ts/VanillaExtractClassName";
import { clsx } from "clsx";





export class NormalButton implements IHasComponent, IButton {
    component: BaseComponent;
    private _title: string;
    private _view: ReactiveProperty<VanillaExtractClassName>;
    private _onClick: (() => void)[] = [];
    
    constructor(title: string, defaultView: VanillaExtractClassName) {
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
            this.component.removeCSSClass(["normal", "warning", "danger"]);
            this.component.addCSSClass(newView);
        });
        this._view.set(this._view.get());
    }

    public setView(view: VanillaExtractClassName): NormalButton {
        this._view.set(view);
        return this;
    }

    public setText(text: string): NormalButton {
        this._title = text;
        this.component.element.textContent = this._title;
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