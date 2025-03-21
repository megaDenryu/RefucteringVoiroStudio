
from pydantic import BaseModel, Field

from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.GPTSetting.GPTSetting import GPTSettingModel
from api.DataStore.AppSetting.AppSettingModel.SerifSetting.SerifSettingModel import SerifSettingModel
from api.DataStore.AppSetting.AppSettingModel.SynthesisVoiceSetting.SynthesisVoiceSettingModel import SynthesisVoiceSettingModel

class AppSettingsModel(BaseModel):
    コメント受信設定: CommentReceiveSettingModel = Field(default_factory=CommentReceiveSettingModel)
    GPT設定: GPTSettingModel = Field(default_factory=GPTSettingModel)
    合成音声設定: SynthesisVoiceSettingModel = Field(default_factory=SynthesisVoiceSettingModel)
    セリフ設定: SerifSettingModel = Field(default_factory=SerifSettingModel)



