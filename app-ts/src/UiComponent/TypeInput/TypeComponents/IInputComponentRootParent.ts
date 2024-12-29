import { RecordPath } from "../RecordPath";

export interface IInputComponentRootParent {
    recusiveRegisterUpdateChildSegment(): void
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void
    オブジェクトデータの特定の子要素の配列から特定番号を削除する(recordPath: RecordPath): void
}