import { IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IComponentManager } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";

export interface IReadingAloudSetting extends IHasComponent, IComponentManager {
    get 読み上げ間隔(): number;
}