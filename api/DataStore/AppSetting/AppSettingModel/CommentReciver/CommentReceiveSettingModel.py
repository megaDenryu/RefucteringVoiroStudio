from pydantic import BaseModel, Field

from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.TwitchLive.TwitchSettingModel import TwitchSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.YoutubeLive.YoutubeLiveSettingModel import YoutubeLiveSettingModel


class CommentReceiveSettingModel(BaseModel):
    ニコニコ生放送: NiconicoLiveSettingModel = Field(default_factory=NiconicoLiveSettingModel)
    YoutubeLive: YoutubeLiveSettingModel = Field(default_factory=YoutubeLiveSettingModel)
    Twitch: TwitchSettingModel = Field(default_factory=TwitchSettingModel)