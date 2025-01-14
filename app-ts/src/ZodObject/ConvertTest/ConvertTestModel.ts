import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord } from "../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";
import { NestedModel } from "./NestedModel";

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
            collectionType: {
                type: "string",
                collectionType: null,
                format: { visualType: "string" }
            },
            format: { visualType: "array" }
        } as InputTypeArray<InputTypeString>,
        Settings: {
            type: "record",
            collectionType: {
                type: "number",
                collectionType: null,
                format: { visualType: "number", step: 1 }
            },
            format: { visualType: "record" }
        } as InputTypeRecord<InputTypeNumber>,
        Nested: NestedModel as InputTypeObject,
    },
    format: {
        visualType: "object",
    },
}
