
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { Talker2V40Format } from "./Talker2V40/Talker2V40Format";
import { TalkerComponentArray2Format } from "./TalkerComponentArray2/TalkerComponentArray2Format";
export const CevioAIVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        talker2V40: Talker2V40Format as InputTypeObject,
        talkerComponentArray2: TalkerComponentArray2Format as InputTypeObject,
        読み上げ間隔: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
