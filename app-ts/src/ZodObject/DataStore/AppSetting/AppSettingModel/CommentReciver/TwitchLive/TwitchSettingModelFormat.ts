
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

export const TwitchSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        配信URL: {
            type: "string",
            collectionType: null,
            format: { visualType: "string" }
        } as InputTypeString,
    },
    format: {
        visualType: "object",
    },
}
