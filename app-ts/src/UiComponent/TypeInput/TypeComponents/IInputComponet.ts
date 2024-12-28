import { EventDelegator } from "../../../BaseClasses/EventDrivenCode/Delegator"
import { IHasComponent } from "../../Base/ui_component_base"
import { IHasSquareBoard } from "../../Board/IHasSquareBoard"
import { ITypeComponent } from "../ComponentType"
import { IRecordPathInput, RecordPath } from "../RecordPath"
import { IInputComponentCollection } from "./ICollectionComponent"
import { IInputComponentRootParent } from "./IInputComponentRootParent"

export interface IInputComponet extends IHasComponent, ITypeComponent {
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
    updateChildSegment: EventDelegator<IRecordPathInput>
}

export function getRootParent(component:IHasSquareBoard & IInputComponet): IHasSquareBoard & IInputComponet {
    if (component.parent == null) {
        return component
    } else {
        return getRootParent(component.parent)
    }
}

export function getComponentManager(component:IInputComponet): IInputComponentRootParent {
    if (component.parent == null) { throw new Error("componentManager is null")}
    const rootParent = getRootParent(component.parent)
    if (rootParent.componentType.includes("IInputComponentCollection")) {
        const componentManager = (rootParent as IInputComponentCollection).componentManager
        if (componentManager == null) {
            throw new Error("componentManager is null")
        } 
        return componentManager
    } else {
        throw new Error("componentManager is null")
    }
}

export function rootParentExecuteOptimizedBoardSize(component:IHasSquareBoard & IInputComponet): void {
    let rootParent = getRootParent(component)
    rootParent.optimizeBoardSize()
}

export function getPath(component:IInputComponet): RecordPath {
    if (component.parent == null) {
        return new RecordPath([])
    } else {
        return getPath(component.parent).addSegment(component.title)
    }
}

export function notifyValueToRootParent(component:IInputComponet): void {
    const value = component.getValue()
    const path = getPath(component)
    const recordPathInput:IRecordPathInput = { recordPath: path, value: value }
    component.updateChildSegment.invoke(recordPathInput)
    console.log("notifyValueToRootParent")

}