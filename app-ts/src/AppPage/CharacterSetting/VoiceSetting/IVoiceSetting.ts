import { IOpenCloseWindow } from "../../../UiComponent/Board/IOpenCloseWindow";
import { RecordPath } from "../../../UiComponent/TypeInput/RecordPath";
import { IComponentManager } from "../../../UiComponent/TypeInput/TypeComponents/IComponentManager";

export interface IVoiceSetting extends IComponentManager {
    inputSimulate(recordPath:RecordPath, value: any): void;
}