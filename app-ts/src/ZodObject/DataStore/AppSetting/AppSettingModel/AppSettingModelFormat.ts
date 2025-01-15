
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { CommentReceiveSettingModelFormat } from "./CommentReciver/CommentReceiveSettingModelFormat";
import { GPTSettingModelFormat } from "./GPTSetting/GPTSettingFormat";
import { SynthesisVoiceSettingModelFormat } from "./SynthesisVoiceSetting/SynthesisVoiceSettingModelFormat";
import { SerifSettingModelFormat } from "./SerifSetting/SpeechRecognitionSettingModelFormat";
export const AppSettingsModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        コメント受信設定: CommentReceiveSettingModelFormat as InputTypeObject,
        GPT設定: GPTSettingModelFormat as InputTypeObject,
        合成音声設定: SynthesisVoiceSettingModelFormat as InputTypeObject,
        セリフ設定: SerifSettingModelFormat as InputTypeObject,
    },
    format: {
        visualType: "object",
    },
}
