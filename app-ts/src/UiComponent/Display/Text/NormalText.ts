import { IHasComponent, BaseComponent, ElementCreater } from "../../Base/ui_component_base";


export class NormalText implements IHasComponent {
    public readonly title: string = "NormalText";
    public component: BaseComponent;
    private _text: string;

    public constructor(text: string) {
        this._text = text;
        const html = `<div>${text}</div>`;
        this.component = new BaseComponent(ElementCreater.createElementFromHTMLString(html));
        this.component.element.innerText = text;
    }

    public delete(): void {
        this.component.delete();
    }

    changeText(text: string): void {
        this._text = text;
        this.component.element.innerText = text;
    }

    
}