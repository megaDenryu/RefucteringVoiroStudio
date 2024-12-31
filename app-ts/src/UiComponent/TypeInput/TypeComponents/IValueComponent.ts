import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IComponentManager } from "./IComponentManager";
import { IInputComponet } from "./IInputComponet";

export interface IValueComponent extends IInputComponet {
    readonly value: ReactiveProperty<any|null>;
    readonly darty: ReactiveProperty<boolean>;

}

