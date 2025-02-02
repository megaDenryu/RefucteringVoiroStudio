
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const NickNameFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        name: {
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
