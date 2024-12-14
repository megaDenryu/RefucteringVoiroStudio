
from pydantic import BaseModel

from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel

class AppSettingsModel(BaseModel):
    コメント受信設定: CommentReceiveSettingModel


