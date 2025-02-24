import { z } from "zod";
import { EventDelegator } from "../../../../BaseClasses/EventDrivenCode/Delegator";
import { ReactiveProperty } from "../../../../BaseClasses/EventDrivenCode/observer";
import { IHasComponent, BaseComponent, ElementCreater } from "../../../Base/ui_component_base";
import { ITypeComponent, TypeComponentInterfaceType, TypeComponentType } from "../../ComponentType";
import { IRecordPathInput, RecordPath } from "../../RecordPath";
import { InputTypeBoolean } from "../../TypeComponentFormat/TypeComponentFormat";
import { IHasInputComponent } from "../CompositeComponent/ICompositeComponentList";
import { IInputComponentCollection } from "../ICollectionComponent";
import { IInputComponet } from "../IInputComponet";
import { IValueComponent } from "../IValueComponent";
import "./BooleanInputComponent.css";
import { simulateCheckboxChange } from "../../../../Extend/ExtendElement/ExtendHTMLInputElement";
import { IResultBase } from "../../../../BaseClasses/ResultBase";


export class BooleanInputComponent implements IHasComponent, IInputComponet, IHasInputComponent, ITypeComponent, IValueComponent<boolean> {
    public readonly componentType: TypeComponentType = "boolean";
    public readonly interfaceType: TypeComponentInterfaceType[] = ["IHasComponent", "IInputComponet", "IHasInputComponent", "IValueComponent"];
    public readonly component: BaseComponent;
    private readonly _title : string;
    private _unitSchema: z.ZodTypeAny;
    public get title():string { return this._title; }
    public readonly value : ReactiveProperty<boolean|null>;
    public readonly darty : ReactiveProperty<boolean>;
    private readonly _save : ReactiveProperty<boolean>;
    private readonly _defaultValue : boolean|null;
    public parent: IInputComponentCollection|null = null;
    public get inputComponent(): IInputComponet { return this; }
    public readonly updateChildSegment: EventDelegator<IRecordPathInput> = new EventDelegator<IRecordPathInput>();
    private _htmlCheckInputElement : HTMLInputElement;
    public readonly inputFormat: InputTypeBoolean|null;

    constructor(title: string, unitSchema: z.ZodTypeAny, defaultValue: boolean|null, parent: IInputComponentCollection|null,
                inputFormat: InputTypeBoolean|null
            ) {
        this._title = title;
        this._unitSchema = unitSchema;
        this._defaultValue = defaultValue;
        this.parent = parent;
        this.value = new ReactiveProperty(defaultValue);
        this.darty = new ReactiveProperty(false);
        this._save = new ReactiveProperty(false);
        let html = ElementCreater.createElementFromHTMLString(this.HTMLDefinition(title));
        this.component = new BaseComponent(html);
        this._htmlCheckInputElement = this.component.element.querySelector(".BooleanInputCheckBox") as HTMLInputElement
        this.inputFormat = inputFormat;
        this.Initialize(this._htmlCheckInputElement);
    }

       /// <summary>
    /// HTMLの定義を返す。
    /// Boolean切り替えのHTMLを作る。
    /// </summary>
    private HTMLDefinition(title:string): string {
        return `
            <div class="BooleanInputComponent">
                <label class="BooleanInputComponentLabel">
                    ${title}
                </label>
                <input class="BooleanInputCheckBox" type="checkbox">
            </div>
        `;
    }

    private Initialize(selecter: HTMLInputElement) {
        this.setValueWithOutSave(this._defaultValue??false);
        selecter.addEventListener("change", () => {
            this.setValue(selecter.checked);
        });

        this.component.addCSSClass([
            "positionAbsolute",
        ]);
        
        // inputイベントのハンドリング
        this._htmlCheckInputElement.addEventListener("input", () => {
            this.darty.set(true);
        });
    }

    public setTitle(title: string): void {
        this.component.element.querySelector(".BooleanInputComponentLabel")!.innerHTML = title;
    }

    public addOnDartyEvent(event: (value: boolean) => void): void {
        this.darty.addMethod(event);
    }

    public addOnSaveEvent(event: (value: boolean) => void): void {
        this._save.addMethod(event);
    }

    public getValue(): boolean|null {
        return this.value.get();
    }

    public isDarty(): boolean {
        return this.darty.get();
    }

    public save(): void {
        if (this.darty.get() == true) {
            this._save.set(true);
            this.darty.set(false);
        }
    }

    public setValue(value: boolean): void {
        this.value.setWithoutEvent(value);
        this._htmlCheckInputElement.checked = value;
    }

    public setValueWithOutSave(value: boolean): void {
        if (this.darty.get() == true) { return; } // ダーティーな状態でない場合のみセットする
        this._htmlCheckInputElement.checked = value;
        this.value.setWithoutEvent(value);
    }

    public getHeight(): number {
        const h = this.component.element.getBoundingClientRect().height;
        return h;
    }

    public getWidth(): number {
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

    public inputSimulate(value: boolean): IResultBase {
        if (typeof value !== "boolean") {console.error("value is not boolean"); return {success: false};}
        return simulateCheckboxChange(this._htmlCheckInputElement, value);
    }

    
}