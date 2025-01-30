
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const AIVoiceVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        読み上げ間隔: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        AIによる文章変換: {
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
