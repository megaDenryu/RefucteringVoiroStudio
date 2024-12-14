from pydantic import BaseModel

from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.TwitchLive.TwitchSettingModel import TwitchSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.YoutubeLive.YoutubeLiveSettingModel import YoutubeLiveSettingModel


class CommentReceiveSettingModel(BaseModel):
    ニコニコ生放送: NiconicoLiveSettingModel
    YoutubeLive: YoutubeLiveSettingModel
    Twitch: TwitchSettingModel