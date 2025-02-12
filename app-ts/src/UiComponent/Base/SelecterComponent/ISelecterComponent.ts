import { simulateSelectValueChange } from "../../../Extend/ExtendElement/ExtendHTMLSelectElement";
import { IHasComponent } from "../ui_component_base";

export interface ISelecterComponent extends IHasComponent {
    get selectElement(): HTMLSelectElement;
    clickSimulate(value: any): void;
}

// ISelecterComponentの中でclickSimulateを実装するときにこれを呼ぶ
export function clickSimulate(ISelecterComponent: ISelecterComponent, value: string): void {
    simulateSelectValueChange(ISelecterComponent.selectElement, value);
}


/**
 * ISelecterComponentを内部に複数持っていたりしていて、ISelecterComponentを代替するもの
 */
export interface ISelecterComponentProxy extends IHasComponent {
    clickSimulate(value: any): void;
}