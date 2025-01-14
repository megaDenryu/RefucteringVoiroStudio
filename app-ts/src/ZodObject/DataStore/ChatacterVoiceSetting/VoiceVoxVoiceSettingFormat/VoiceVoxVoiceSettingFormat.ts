import { InputTypeObject, InputTypeString, InputTypeNumber } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";


export const VoiceVoxVoiceSettingFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        speedScale :{
            type: "number",
            collectionType: null,
            format: { 
                visualType: "number",
                step: 0.1,
            }
        } as InputTypeNumber,
        pitchScale :{
            type: "number",
            collectionType: null,
            format: { 
                visualType: "number",
                step: 0.01,
            }
        } as InputTypeNumber,
        intonationScale :{
            type: "number",
            collectionType: null,
            format: { 
                visualType: "number",
                step: 0.1,
            }
        } as InputTypeNumber,
        volumeScale :{
            type: "number",
            collectionType: null,
            format: { 
                visualType: "number",
                step: 0.1,
            }
        } as InputTypeNumber
    },
    format: {
        visualType: "object",
    },
} as InputTypeObject