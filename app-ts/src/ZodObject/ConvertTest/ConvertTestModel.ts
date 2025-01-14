import { InputTypeArray, InputTypeBoolean, InputTypeNumber, InputTypeObject, InputTypeRecord, InputTypeString } from "../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const ConvertTestModel:InputTypeObject = {
    type: "object",
    collectionType: {
        Id: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
        Name: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
        Value: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
        } as InputTypeNumber,
        IsActive: {
            type: "boolean",
            collectionType: null,
            format: { visualType: "boolean" }
        } as InputTypeBoolean,
        Options: {
            type: "array",
            collection: [],
            format: { visualType: "array" }
        } as InputTypeArray,
        Settings: {
            type: "record",
            collectionType: {},
            format: { visualType: "record" }
        } as InputTypeRecord,
    },
    format: {
        visualType: "object",
    },
}
