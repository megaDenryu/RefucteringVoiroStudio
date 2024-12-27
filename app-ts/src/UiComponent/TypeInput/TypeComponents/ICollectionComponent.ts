import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { RecordPath } from "../RecordPath";
import { IInputComponet } from "./IInputComponet";

export interface ICollectionComponent extends IInputComponet, IHasSquareBoard {
    updateChildSegment(path:RecordPath, value:any ): void
}