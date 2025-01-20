
import { InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum } from "../../../../../UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat";

import { NiconicoLiveSettingModelFormat } from "./NiconicoLive/NiconicoLiveSettingModelFormat";
import { YoutubeLiveSettingModelFormat } from "./YoutubeLive/YoutubeLiveSettingModelFormat";
import { TwitchSettingModelFormat } from "./TwitchLive/TwitchSettingModelFormat";
export const CommentReceiveSettingModelFormat:InputTypeObject = {
    type: "object",
    collectionType: {
        ニコニコ生放送: NiconicoLiveSettingModelFormat as InputTypeObject,
        YoutubeLive: YoutubeLiveSettingModelFormat as InputTypeObject,
        Twitch: TwitchSettingModelFormat as InputTypeObject,
    },
    format: {
        visualType: "object",
        visualTitle: null
    },
}
