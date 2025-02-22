
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const CoeiroinkVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        speedScale: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 0.01 }
        } as InputTypeNumber,
        pitchScale: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 0.01 }
        } as InputTypeNumber,
        intonationScale: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 0.01 }
        } as InputTypeNumber,
        volumeScale: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 0.01 }
        } as InputTypeNumber,
        読み上げ間隔: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 0.01 }
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
