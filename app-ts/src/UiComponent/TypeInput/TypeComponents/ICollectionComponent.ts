import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IInputComponet } from "./IInputComponet";

export interface IInputComponentCollection extends IInputComponet, IHasSquareBoard {
    get inputComponentList(): IInputComponet[];
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


export function recusiveregisterUpdateChildSegment(
    inputComponent: IInputComponentCollection,
    eventName: string , 
    updateChildSegment: (recordPath: RecordPath, value: any) => void
): void {
    inputComponent.updateChildSegment.addMethod(
        (recordPathInput) => {
            updateChildSegment(recordPathInput.recordPath, recordPathInput.value);
        }, 
        eventName
    );
    extractIInputComponentCollections(inputComponent).forEach((inputComponent) => {
        recusiveregisterUpdateChildSegment(inputComponent, eventName ,updateChildSegment);
    });
}