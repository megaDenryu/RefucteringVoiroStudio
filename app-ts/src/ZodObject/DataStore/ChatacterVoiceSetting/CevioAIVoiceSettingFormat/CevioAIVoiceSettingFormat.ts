import { InputTypeNumber, InputTypeObject, InputTypeRecord, InputTypeString } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";



export const Talker2V40:InputTypeObject = {
    type: "object",
    collection: {
        Cast: {
            type: "string",
            collection: null,
            format: { visualType: "string" }
        } as InputTypeString,
        Volume: {
            type: "number",
            collection: null,
            format: { 
                visualType: "number",
                step: 1,
            }
        } as InputTypeNumber,
        Speed: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        Tone: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        Alpha: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        ToneScale: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
    },
}

export const TalkerComponentArray2:InputTypeObject = {
    type: "object",
    collection: {
        record: {
            type: "record",
            collection: {},
            format: { visualType: "record"}
        } as InputTypeRecord,
    },
    format: {
        visualType: "object",
    },
}

export const CevioAIVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collection: {
        talker2V40: Talker2V40,
        talkerComponentArray2: TalkerComponentArray2,
    },
    format: {
        visualType: "object",
    },
}