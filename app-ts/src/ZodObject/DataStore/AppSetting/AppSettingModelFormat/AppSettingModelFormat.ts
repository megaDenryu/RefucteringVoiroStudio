import { InputTypeObject, InputTypeString, InputTypeEnum, InputTypeArray, InputTypeNumber, InputTypeBoolean } from "../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

const 配信URL: InputTypeString = {
    type: "string",
    collection: null,
    format: { visualType: "text" }
};

const コメント受信: InputTypeEnum = {
    type: "enum",
    collection: null,
    format: { visualType: "dropdown" }
};

const コメント禁止ワード: InputTypeArray<InputTypeString> = {
    type: "array",
    collection: [
        {
            type: "string",
            collection: null,
            format: { visualType: "text" }
        } as InputTypeString
    ],
    format: { visualType: "list" }
};

const GPT起動状況: InputTypeEnum = {
    type: "enum",
    collection: null,
    format: { visualType: "dropdown" }
};

const path: InputTypeString = {
    type: "string",
    collection: null,
    format: { visualType: "text" }
};

const 発言間隔の秒数: InputTypeNumber = {
    type: "number",
    collection: null,
    format: { visualType: "number", step: 5 }
};

const AI補正: InputTypeBoolean = {
    type: "boolean",
    collection: null,
    format: { visualType: "checkbox" }
};

const NiconicoLiveSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        配信URL: 配信URL as InputTypeString,
        コメント受信: コメント受信 as InputTypeEnum,
        コメント禁止ワード: コメント禁止ワード as InputTypeArray<InputTypeString>
    },
    format: { visualType: "group" }
};

const YoutubeLiveSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        配信URL: 配信URL as InputTypeString
    },
    format: { visualType: "group" }
};

const TwitchSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        配信URL: 配信URL as InputTypeString
    },
    format: { visualType: "group" }
};

const CommentReceiveSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        ニコニコ生放送: NiconicoLiveSettingModel as InputTypeObject,
        YoutubeLive: YoutubeLiveSettingModel as InputTypeObject,
        Twitch: TwitchSettingModel as InputTypeObject
    },
    format: { visualType: "group" }
};

const GPTSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        GPT起動状況: GPT起動状況 as InputTypeEnum
    },
    format: { visualType: "group" }
};

const COEIROINKv2SettingModel: InputTypeObject = {
    type: "object",
    collection: {
        path: path as InputTypeString
    },
    format: { visualType: "group" }
};

const SynthesisVoiceSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        COEIROINKv2設定: COEIROINKv2SettingModel as InputTypeObject
    },
    format: { visualType: "group" }
};

const SerifSettingModel: InputTypeObject = {
    type: "object",
    collection: {
        AI補正: AI補正 as InputTypeBoolean,
        発言間隔の秒数: 発言間隔の秒数 as InputTypeNumber
    },
    format: { visualType: "group" }
};

export const AppSettingsModelFormat: InputTypeObject = {
    type: "object",
    collection: {
        コメント受信設定: CommentReceiveSettingModel as InputTypeObject,
        GPT設定: GPTSettingModel as InputTypeObject,
        合成音声設定: SynthesisVoiceSettingModel as InputTypeObject,
        セリフ設定: SerifSettingModel as InputTypeObject
    },
    format: { visualType: "form" }
};
