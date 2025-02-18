import { IResultBase } from "../../../BaseClasses/ResultBase";
import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IComponentManager } from "./IComponentManager";
import { IInputComponet } from "./IInputComponet";
import { IValueComponent } from "./IValueComponent";

export interface IInputComponentCollection extends IInputComponet, IHasSquareBoard {
    get inputComponentList(): IInputComponet[];
    readonly componentManager: IComponentManager|null;
    inputSimulate(recordPath:RecordPath, value: any): IResultBase
}

export function isIInputComponentCollection(inputComponent: IInputComponet): boolean {
    return inputComponent.interfaceType.includes("IInputComponentCollection");
}

export function isIInputComponentCollection2(
    inputComponent: IInputComponet
): inputComponent is IInputComponentCollection {
    let ret = (
        'inputComponentList' in inputComponent &&
        Array.isArray((inputComponent as IInputComponentCollection).inputComponentList) &&
        'componentManager' in inputComponent
    );
    return ret;
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
 * 実装方法としては再帰的に登録するのはするのはrecusiveRegisterUpdateChildSegmentと同じですが、デリゲーターにeventNameが登録されていない場合のみ登録します。
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

/**
 * RecordPathの子要素のInputComponentを取得する
 * @param inputComponentCollection 
 * @param recordPath
 */
export function recusiveGetRecordPathChild<T>(
    inputComponentCollection: IInputComponentCollection,
    recordPath: RecordPath
): IValueComponent<T> {
    if (recordPath.path.length == 0) {
        throw new Error("recordPath is empty");
    }
    let child = inputComponentCollection.inputComponentList.find((inputComponent) => {
        return inputComponent.title == recordPath.path[0];
    });
    if (child == null) {
        throw new Error("Not found child");
    }
    if (recordPath.path.length == 1) {
        return child as IValueComponent<T>;
    }
    if (isIInputComponentCollection2(child)) {
        return recusiveGetRecordPathChild(child, recordPath.shift());
    }
    throw new Error("Not found child");
}