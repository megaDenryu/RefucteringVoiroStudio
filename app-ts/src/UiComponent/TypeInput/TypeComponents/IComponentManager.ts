import { object } from "zod";
import { RecordPath } from "../RecordPath";

export interface IComponentManager {
    manageData: {}
    recusiveRegisterUpdateChildSegment(): void
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath: RecordPath): void
}

/**
 * コレクションの内部のインプット要素の保存ボタンを押したときに実行するイベントなので、セーブボタンコンポーネントに持たせる必要がある
 * @param componentManager 
 * @param recordPath 
 * @param value 
 */
export function オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(componentManager:IComponentManager ,recordPath:RecordPath, value:any) {
    RecordPath.modifyRecordByPathWithTypes(componentManager.manageData, {recordPath:recordPath, value:value})
}

export function オブジェクトデータの特定の子要素の配列から特定番号を削除する(componentManager:IComponentManager, recordPath:RecordPath) {
    RecordPath.deleteRecordByPathWithTypes(componentManager.manageData, recordPath)
}