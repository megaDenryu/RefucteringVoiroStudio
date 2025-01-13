import { InputTypeNumber, InputTypeObject } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const CoeiroinkVoiceSettingFormat:InputTypeObject = {
    type: "object",
    collection: {
        speedScale: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 0.01 }
        } as InputTypeNumber,
        pitchScale: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 0.01 }
        } as InputTypeNumber,
        intonationScale: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 0.01 }
        } as InputTypeNumber,
        volumeScale: {
            type: "number",
            collection: null,
            format: { visualType: "number", step: 0.01 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
    },
}