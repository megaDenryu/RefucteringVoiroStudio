
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { CharacterRelationshipsFormat } from "./CharacterAISetting_CharacterRelationshipsFormat";
import { ActionPatternFormat } from "./CharacterAISetting_ActionPatternFormat";
export const CharacterAISettingFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        名前: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        年齢: {
            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
        } as InputTypeNumber,
        性別: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        背景情報: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        役割: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        動機: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        アリバイ: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        性格特性: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        関係: {
            type: "array",
            collectionType: CharacterRelationshipsFormat,
            format: { visualType: "array", visualTitle: null }
        } as InputTypeArray<InputTypeObject>,
        秘密: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        知っている情報: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        外見の特徴: {
            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
        } as InputTypeString,
        所持品: {
            type: "array",
            collectionType: {
                type: "string",
                collectionType: null,
                format: { visualType: "string", visualTitle: null }
            }
,
            format: { visualType: "array", visualTitle: null }
        } as InputTypeArray<InputTypeString>,
        行動パターン: {
            type: "array",
            collectionType: ActionPatternFormat,
            format: { visualType: "array", visualTitle: null }
        } as InputTypeArray<InputTypeObject>,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
