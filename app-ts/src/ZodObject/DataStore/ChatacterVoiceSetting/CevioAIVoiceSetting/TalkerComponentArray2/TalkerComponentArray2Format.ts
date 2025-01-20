
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const TalkerComponentArray2Format:InputTypeObject = {
    type: "object",
    collectionType: {
        record: {
            type: "record",
            collectionType: {
                type: "number",
                collectionType: null,
                format: { visualType: "number", visualTitle: null, step: 1 }
            },
            format: { visualType: "record", visualTitle: null }
        } as InputTypeRecord<InputTypeNumber>,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
