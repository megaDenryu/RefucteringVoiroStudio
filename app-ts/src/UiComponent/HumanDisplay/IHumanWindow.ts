import { CharacterId, CharacterModeState } from "../../ValueObject/Character";
import { BaseComponent, IHasComponent } from "../Base/ui_component_base";


export interface IHumanTab extends IHasComponent{
    component: BaseComponent;
    humanWindow: IHumanWindow
    humanName: IHumanName
    deleteHumanButton: IDeleteHumanButton
    humanSelectPanelStartButton: IHumanSelectPanelStartButton
    bodySettingButton: IBodySettingButton
    micToggleButton: IMicToggleButton
    addHumanButton: IAddHumanButton
    characterId: CharacterId;
    characterModeState: CharacterModeState|null;
}

export interface IHumanWindow extends IHasComponent{
    component: BaseComponent;
}

export interface IHumanName extends IHasComponent{
    component: BaseComponent;
}

export interface IDeleteHumanButton extends IHasComponent{
    component: BaseComponent;
}

export interface IHumanSelectPanelStartButton extends IHasComponent{
    component: BaseComponent;
}

export interface IBodySettingButton extends IHasComponent{
    component: BaseComponent;
}
export interface IMicToggleButton extends IHasComponent{
    component: BaseComponent;
}
export interface IAddHumanButton extends IHasComponent{
    component: BaseComponent;
}

export interface IBackGroundImage extends IHasComponent{
    component: BaseComponent;

    setBackGroundImage(readerResult: string): void;
}

export interface IBackGroundImages extends IHasComponent{
    component: BaseComponent;
}