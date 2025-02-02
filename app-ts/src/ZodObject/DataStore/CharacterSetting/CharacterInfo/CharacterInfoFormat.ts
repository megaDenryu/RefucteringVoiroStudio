
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { CharacterNameFormat } from "../../../gptAI/HumanInfoValueObject_CharacterNameFormat";
import { NickNameFormat } from "../../../gptAI/HumanInfoValueObject_NickNameFormat";
import { HumanImageFormat } from "../../../gptAI/HumanInfoValueObject_HumanImageFormat";
import { CharacterAISettingFormat } from "../../../AppSettingJson/CharcterAISetting/CharacterAISettingFormat";
export const CharacterInfoFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        characterName: CharacterNameFormat as InputTypeObject,
        nickName: NickNameFormat as InputTypeObject,
        humanImage: HumanImageFormat as InputTypeObject,
        aiSetting: CharacterAISettingFormat as InputTypeObject,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
