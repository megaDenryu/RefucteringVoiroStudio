
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const NiconicoLiveSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        配信URL: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
        コメント受信: {
            type: "enum",
            collectionType: null,
            format: { visualType: "enum" }
        } as InputTypeEnum,
        コメント禁止ワード: {
            type: "array",
            collectionType: {
                type: "string",
                collectionType: null,
                format: { visualType: "string" }
            },
            format: { visualType: "array" }
        } as InputTypeArray<InputTypeString>,
    },
    format: {
        visualType: "object",
    },
}
