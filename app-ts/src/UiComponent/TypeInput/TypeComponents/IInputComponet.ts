import { IHasComponent } from "../../Base/ui_component_base"

export interface IInputComponet extends IHasComponent {
    get title():string
    setTitle(title:string):void
    addOnDartyEvent(event: (value: boolean) => void): void
    addOnSaveEvent(event: (value: boolean) => void): void
    getValue(): any
    isDarty(): boolean
    save(): void
    getHeight(): number
    getWidth(): number
    parent: IInputComponet|null
}

export function getRootParent(component:IInputComponet): IInputComponet {
    if (component.parent == null) {
        return component
    } else {
        return getRootParent(component.parent)
    }
}