
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const ActionPatternFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        感情: {
            type: "enum",
            collectionType: null,
            format: { visualType: "enum", visualTitle: null }
        } as InputTypeEnum,
        行動: {
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
