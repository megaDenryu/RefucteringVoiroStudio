
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const CharacterRelationshipsFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        他のキャラクター名: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        関係: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
