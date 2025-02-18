
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { COEIROINKv2SettingModelFormat } from "./COEIROINKv2Setting/COEIROINKv2Setting_COEIROINKv2SettingModelFormat";
export const SynthesisVoiceSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        COEIROINKv2設定: COEIROINKv2SettingModelFormat as InputTypeObject,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
