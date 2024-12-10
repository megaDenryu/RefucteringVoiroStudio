import { IHasComponent } from "../../Base/ui_component_base"

export interface IInputComponet extends IHasComponent {
    addOnDartyEvent(event: (value: boolean) => void): void
    addOnSaveEvent(event: (value: boolean) => void): void
    getValue(): any
    isDarty(): boolean
    save(): void
}