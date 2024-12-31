import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IComponentManager } from "./IComponentManager";
import { IInputComponet } from "./IInputComponet";

export interface IInputComponentCollection extends IInputComponet, IHasSquareBoard {
    get inputComponentList(): IInputComponet[];
    readonly componentManager: IComponentManager|null;
}

export function isIInputComponentCollection(inputComponent: IInputComponet): boolean {
    return inputComponent.interfaceType.includes("IInputComponentCollection");
}

export function extractIInputComponentCollections(componentCollection: IInputComponentCollection): IInputComponentCollection[] {
    return componentCollection.inputComponentList.filter((inputComponent) => {
        if (isIInputComponentCollection(inputComponent)) {
            return true;
        }
    }) as IInputComponentCollection[];
}

/**
 * 子要素に対して、updateChildSegmentを再帰的に登録します。
 * @param inputComponentCollection 
 * @param eventName 
 * @param updateChildSegment 
 */
export function recusiveRegisterUpdateChildSegment(
    inputComponentCollection: IInputComponentCollection,
    eventName: string , 
    updateChildSegment: (recordPath: RecordPath, value: any) => void
): void {
    inputComponentCollection.inputComponentList.forEach((inputComponent) => {
        inputComponent.updateChildSegment.addMethod(
            (recordPathInput) => {
                updateChildSegment(recordPathInput.recordPath, recordPathInput.value);
            }, 
            eventName
        );
    });
    extractIInputComponentCollections(inputComponentCollection).forEach((inputComponent) => {
        recusiveRegisterUpdateChildSegment(inputComponent, eventName ,updateChildSegment);
    });
}

/**
 * この関数は、新しい子コンポーネントが追加されたときに、その子コンポーネントに対して、updateChildSegmentを登録します。
 * 実装方法としては再帰的に登録するのはするのはrecusiveRegisterUpdateChildSegmentと同じですが、でリゲーターにeventNameが登録されていない場合のみ登録します。
 * @param inputComponentCollection 
 * @param eventName 
 * @param updateChildSegment 
 */
export function recusiveRegisterUpdateChildSegmentToNewChild(
    inputComponentCollection: IInputComponentCollection,
    eventName: string , 
    updateChildSegment: (recordPath: RecordPath, value: any) => void
): void {
    inputComponentCollection.inputComponentList.forEach((inputComponent) => {
        if (inputComponent.updateChildSegment.hasMethod(eventName) == false) {
            inputComponent.updateChildSegment.addMethod(
                (recordPathInput) => {
                    updateChildSegment(recordPathInput.recordPath, recordPathInput.value);
                }, 
                eventName
            );
        }
    });
    extractIInputComponentCollections(inputComponentCollection).forEach((inputComponent) => {
        recusiveRegisterUpdateChildSegmentToNewChild(inputComponent, eventName ,updateChildSegment);
    });
}