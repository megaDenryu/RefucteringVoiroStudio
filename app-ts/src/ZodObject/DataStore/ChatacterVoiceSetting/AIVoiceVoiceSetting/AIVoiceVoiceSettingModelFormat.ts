
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const AIVoiceVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        声の調整方法: {
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
