import { IHasComponent } from "../../Base/ui_component_base"
import { IHasSquareBoard } from "../../Board/IHasSquareBoard"

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
    parent: (IHasSquareBoard & IInputComponet)|null
}

export function getRootParent(component:IHasSquareBoard & IInputComponet): (IHasSquareBoard & IInputComponet) {
    if (component.parent == null) {
        return component
    } else {
        return getRootParent(component.parent)
    }
}

export function rootParentExecuteOptimizedBoardSize(component:IHasSquareBoard & IInputComponet): void {
    let rootParent = getRootParent(component)
    rootParent.optimizeBoardSize()
}