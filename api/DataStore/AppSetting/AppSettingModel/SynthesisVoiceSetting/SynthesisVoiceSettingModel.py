

from pydantic import BaseModel, Field
from api.DataStore.AppSetting.AppSettingModel.SynthesisVoiceSetting.COEIROINKv2Setting.COEIROINKv2Setting import COEIROINKv2SettingModel


class SynthesisVoiceSettingModel(BaseModel):
    COEIROINKv2設定: COEIROINKv2SettingModel = Field(default_factory=COEIROINKv2SettingModel)