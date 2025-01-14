import { InputTypeObject, InputTypeString } from "../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const NestedModel:InputTypeObject = {
    type: "object",
    collectionType: {
        SubValue: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
    },
    format: {
        visualType: "object",
    },
}
