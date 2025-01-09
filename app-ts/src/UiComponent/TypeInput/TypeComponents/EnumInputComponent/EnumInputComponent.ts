
import { UnionType } from "typescript";
import { BaseComponent, ElementCreater, HtmlElementInput, IHasComponent } from "../../../Base/ui_component_base";
import { IInputComponet } from "../IInputComponet";
import { ReactiveProperty } from "../../../../BaseClasses/EventDrivenCode/observer";
import { SelecteValueInfo } from "./SelecteValueInfo";
import "./EnumInputComponent.css";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IHasSquareBoard } from "../../../Board/IHasSquareBoard";
import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { IRecordPathInput } from "../../RecordPath";
import { TypeComponentType, TypeComponentInterfaceType } from "../../ComponentType";
import { IInputComponentCollection } from "../ICollectionComponent";
import { IValueComponent } from "../IValueComponent";

export class EnumInputComponent implements IHasComponent, IInputComponet, IHasInputComponent, IValueComponent {
    public readonly componentType: TypeComponentType = "enum";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponet", "IHasInputComponent", "IValueComponent"];
    public readonly component: BaseComponent;
    private _title : string;
    public get title(): string { return this._title; }
    public value: ReactiveProperty<SelecteValueInfo>;
    public darty: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    private _save: ReactiveProperty<boolean> = new ReactiveProperty<boolean>(false);
    public parent: IInputComponentCollection|null = null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    private _htmlSelectElement: HTMLSelectElement;

    constructor(title: string, defautValue: SelecteValueInfo, parent: IInputComponentCollection|null = null) {
        this._title = title;
        this.value = new ReactiveProperty<SelecteValueInfo>(defautValue);
        this.parent = parent;
        let selecter:HTMLSelectElement = ElementCreater.createSelectElement(defautValue.candidate, null, defautValue.value);
        let divHtml = ElementCreater.createElementFromHTMLString(`
            <div class="EnumInputComponent">
                <label class="EnumInputComponentLabel">${title}</label>
            </div>
            `);
        divHtml.appendChild(selecter);
        this.component = new BaseComponent(divHtml);
        this.initialize(selecter);
        this._htmlSelectElement = selecter;
    }

    public setTitle(title: string): void {
        this._title = title;
        let titleContent = this.component.element.querySelector(".EnumInputComponentLabel");
        if (titleContent != null) {
            titleContent.textContent = title;
        }
    }

    private initialize(selecter:HTMLSelectElement): void {
        selecter.addEventListener("change", () => {
            console.log("change",selecter.value);
            this.setValue(selecter.value);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
    }

    addOnChangeEvent(event: (value: SelecteValueInfo) => void): void {
        this.value.addMethod(event);
    }

    addOnDartyEvent(event: (value: boolean) => void): void {
        this.darty.addMethod(event);
    }

    addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    getValue(): string {
        return this.value.get().value;
    }

    isDarty(): boolean {
        return this.darty.get();
    }

    public save(): void {
        if (this.darty.get() == true) {
            this._save.set(true);
            this.darty.set(false);
        }
    }

    setValue(value: string): void {
        let info = this.value.get();
        info.value = value;
        this.value.set(info);
        this.darty.set(true);
    }

    setValueWithOutSave(value: any): void {
        let info = this.value.get();
        info.value = value;
        this._htmlSelectElement.value = value;
        this.value.setWithoutEvent(info);
    }

    getHeight(): number {
        const h = this.component.element.getBoundingClientRect().height;
        return h;
    }

    getWidth(): number {
        const w = this.component.element.getBoundingClientRect().width;
        return w;
    }

    public delete(): void {
        // DOM 要素を削除
        this.component.delete();
        // ReactiveProperty インスタンスのクリーンアップ
        this.value.clearMethods();
        this.darty.clearMethods();
        this._save.clearMethods();
    }
}

