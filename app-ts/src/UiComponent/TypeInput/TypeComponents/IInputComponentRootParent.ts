import { RecordPath } from "../RecordPath";

export interface IInputComponentRootParent {
    recusiveRegisterUpdateChildSegment(): void
    オブジェクトデータの特定の子要素のセグメントのみを部分的に修正する(recordPath: RecordPath, value: any): void
}