import { IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { IComponentManager } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";

export interface ICharacterInfoSetting extends IHasComponent, IOpenCloseWindow, IComponentManager {
    onAddedToDom(): void;
}