
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { Talker2V40Format } from "./Talker2V40/Talker2V40Format";
import { TalkerComponentArray2Format } from "./TalkerComponentArray2/TalkerComponentArray2Format";
export const CevioAIVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        コンディション: Talker2V40Format as InputTypeObject,
        感情: TalkerComponentArray2Format as InputTypeObject,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
