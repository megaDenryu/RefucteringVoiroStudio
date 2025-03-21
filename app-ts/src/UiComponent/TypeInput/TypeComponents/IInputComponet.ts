import { EventDelegator } from "../../../BaseClasses/EventDrivenCode/Delegator"
import { IResultBase } from "../../../BaseClasses/ResultBase"
import { IHasComponent } from "../../Base/ui_component_base"
import { IHasSquareBoard } from "../../Board/IHasSquareBoard"
import { ITypeComponent } from "../ComponentType"
import { IRecordPathInput, RecordPath } from "../RecordPath"
import { InputTypeComponentFormat } from "../TypeComponentFormat/TypeComponentFormat"
import { IInputComponentCollection } from "./ICollectionComponent"
import { IComponentManager } from "./IComponentManager"

export interface IInputComponet extends IHasComponent, ITypeComponent {
    get title():string
    setTitle(title:string):void
    addOnDartyEvent(event: (value: boolean) => void): void
    addOnSaveEvent(event: (value: boolean) => void): void
    getValue(): any
    setValueWithOutSave(value: any): void
    isDarty(): boolean
    save(): void
    getHeight(): number
    getWidth(): number
    parent: IInputComponentCollection|null
    updateChildSegment: EventDelegator<IRecordPathInput>
    inputFormat: InputTypeComponentFormat|null
}

export function getRootParent(component:IInputComponentCollection): IInputComponentCollection {
    if (component.parent == null) {
        return component
    } else {
        return getRootParent(component.parent)
    }
}

export function getComponentManager(component:IInputComponet): IComponentManager {
    if (component.parent == null) { 
        throw new Error("componentManager is null")
    }
    const rootParent = getRootParent(component.parent)
    const componentManager = rootParent.componentManager
    if (componentManager == null) {
        throw new Error("componentManager is null")
    } 
    return componentManager
}

export function getComponentManagerFromComponentCollection(component:IInputComponentCollection): IComponentManager {
    const rootParent = getRootParent(component.parent ?? component)
    const componentManager = rootParent.componentManager
    if (componentManager == null) {
        throw new Error("componentManager is null")
    } 
    return componentManager
}

export function rootParentExecuteOptimizedBoardSize(component:IInputComponentCollection): void {
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
    const manageComponent = getComponentManager(component)
    manageComponent.オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(path, value)
}

export function notifyValueToRootParentFromComponentCollection (component:IInputComponentCollection): void {
    const value = component.getValue()
    const path = getPath(component)
    const recordPathInput:IRecordPathInput = { recordPath: path, value: value }
    const manageComponent = getComponentManagerFromComponentCollection(component)
    manageComponent.オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(path, value)
}