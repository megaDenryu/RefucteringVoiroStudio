
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const Talker2V40Format:InputTypeObject = {
    type: "object",
    collectionType: {
        Cast: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        Volume: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        Speed: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        Tone: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        Alpha: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        ToneScale: {
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
