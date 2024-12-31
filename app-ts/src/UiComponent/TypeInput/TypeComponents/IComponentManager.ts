import { object } from "zod";
import { RecordPath } from "../RecordPath";

export interface IComponentManager<T extends {}> {
    manageData: T
    recusiveRegisterUpdateChildSegment(): void
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath: RecordPath): void
}


export function オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する<T extends {}>(componentManager:IComponentManager<T> ,recordPath:RecordPath, value:any) {
    RecordPath.modifyRecordByPathWithTypes<T>(componentManager.manageData, {recordPath:recordPath, value:value})
}

export function オブジェクトデータの特定の子要素の配列から特定番号を削除する<T extends {}>(componentManager:IComponentManager<T>, recordPath:RecordPath) {
    RecordPath.deleteRecordByPathWithTypes<T>(componentManager.manageData, recordPath)
}