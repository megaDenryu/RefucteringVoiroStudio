import { input } from "zod";
import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IResultBase } from "../../../BaseClasses/ResultBase";
import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IComponentManager } from "./IComponentManager";
import { IInputComponet } from "./IInputComponet";

export interface IValueComponent<T> extends IInputComponet {
    readonly value: ReactiveProperty<any|null>;
    readonly darty: ReactiveProperty<boolean>;
    inputSimulate(value: T): IResultBase
}

export function isIValueComponent<T>(inputComponent: IInputComponet): inputComponent is IValueComponent<T> {
    return (
        'value' in inputComponent &&
        'darty' in inputComponent &&
        typeof (inputComponent as any).inputSimulate === 'function'
    );
}

