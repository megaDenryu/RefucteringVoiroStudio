
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const GPTSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        GPT起動状況: {
            type: "enum",
            collectionType: null,
            format: { visualType: "enum", visualTitle: null }
        } as InputTypeEnum,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
