
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const COEIROINKv2SettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        path: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
