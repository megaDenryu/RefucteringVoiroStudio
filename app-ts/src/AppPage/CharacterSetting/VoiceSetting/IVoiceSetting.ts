import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";

export interface IVoiceSetting extends IComponentManager {
    get 読み上げ間隔(): number;
    inputSimulate(recordPath:RecordPath, value: any): void;
}