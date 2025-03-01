
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const CoeiroinkVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        スピード: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        ピッチ: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        イントネーション: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        音量: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
