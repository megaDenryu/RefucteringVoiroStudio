import { IHasComponent } from "../../../UiComponent/Base/ui_component_base";
import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { IComponentManager } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";
import { NickName, CharacterName } from "../../../ValueObject/Character";

export interface ICharacterInfoSetting extends IHasComponent, IComponentManager {
    onAddedToDom(): void;
    get nickName(): NickName;
    get characterName(): CharacterName;
}