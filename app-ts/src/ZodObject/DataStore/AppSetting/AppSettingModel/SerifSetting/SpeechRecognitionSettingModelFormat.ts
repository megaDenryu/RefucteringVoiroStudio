
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const SerifSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        AI補正: {
            type: "boolean",
            collectionType: null,
            format: { visualType: "boolean" }
        } as InputTypeBoolean,
        発言間隔の秒数: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
    },
}
