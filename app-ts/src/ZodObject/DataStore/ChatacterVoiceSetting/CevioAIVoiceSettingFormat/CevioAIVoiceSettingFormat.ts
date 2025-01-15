import { InputTypeNumber, InputTypeObject, InputTypeRecord, InputTypeString } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";



export const Talker2V40:InputTypeObject = {
    type: "object",
    collectionType: {
        Cast: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
        Volume: {
            type: "number",
            collectionType: null,
            format: { 
                visualType: "number",
                step: 1,
            }
        } as InputTypeNumber,
        Speed: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        Tone: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        Alpha: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        ToneScale: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
    },
}

export const TalkerComponentArray2:InputTypeObject = {
    type: "object",
    collectionType: {
        record: {
            type: "record",
            collectionType: {
                type: "number",
                collectionType: null,
                format: { visualType: "number", step: 1 }
            },
            format: { visualType: "record"}
        } as InputTypeRecord<InputTypeNumber>,
    },
    format: {
        visualType: "object",
    },
}

export const CevioAIVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        talker2V40: Talker2V40,
        talkerComponentArray2: TalkerComponentArray2,
    },
    format: {
        visualType: "object",
    },
}