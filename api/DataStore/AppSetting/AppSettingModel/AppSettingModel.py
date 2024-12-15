
from pydantic import BaseModel, Field

from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel

class AppSettingsModel(BaseModel):
    コメント受信設定: CommentReceiveSettingModel = Field(default_factory=CommentReceiveSettingModel)


