

from pydantic import BaseModel, Field
from api.DataStore.AppSetting.AppSettingModel.SynthesisVoiceSetting.COEIROINKv2Setting.COEIROINKv2Setting import COEIROINKv2SettingModel
from api.DataStore.AppSetting.AppSettingModel.SynthesisVoiceSetting.VoiceVoxSettingModel.VoiceVoxSettingModel import VoiceVoxSettingModel


class SynthesisVoiceSettingModel(BaseModel):
    COEIROINKv2設定: COEIROINKv2SettingModel = Field(default_factory=COEIROINKv2SettingModel)
    VoiceVox設定: VoiceVoxSettingModel = Field(default_factory=VoiceVoxSettingModel)