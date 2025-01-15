
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const COEIROINKv2SettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        path: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
    },
    format: {
        visualType: "object",
    },
}
