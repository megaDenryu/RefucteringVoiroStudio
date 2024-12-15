


from pprint import pprint
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from pydantic.fields import FieldInfo

from api.Extend.ExtendFunc import ExtendFunc



def Fieldのdescriptionなどの情報を取得する():
    nico = NiconicoLiveSettingModel()
    print(nico.配信URL)
    fields = NiconicoLiveSettingModel.model_fields
    print(fields["配信URL"].description)
    for fieldname in fields:
        field:FieldInfo = fields[fieldname]
        print(field.description)

def Field_factoryを使ってみる():
    crs = CommentReceiveSettingModel()
    ExtendFunc.ExtendPrint("CommentReceiveSettingModel",crs)
