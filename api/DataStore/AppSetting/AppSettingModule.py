from pydantic import BaseModel
from starlette.websockets import WebSocket
from enum import Enum
from api.DataStore.AppSetting import AppSettingModel
from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.TwitchLive.TwitchSettingModel import TwitchSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.YoutubeLive.YoutubeLiveSettingModel import YoutubeLiveSettingModel
from api.DataStore.JsonAccessor import JsonAccessor

class PageMode(str, Enum):
    Setting = "Setting"
    Chat = "Chat"


class ConnectionStatus:
    client_id: str
    ws: WebSocket
    page_mode: PageMode
    setting_mode: str
    def __init__(self, client_id: str, ws: WebSocket, page_mode: PageMode, setting_mode: str):
        self.client_id = client_id
        self.ws = ws
        self.page_mode = page_mode
        self.setting_mode = setting_mode

class AppSettingModule:
    def __init__(self):
        self.setting_client_ws:dict[str,dict[PageMode,list[ConnectionStatus]]] = {}
        self.setting = self.loadSetting()

    def addWs(self, setting_mode: str, page_mode:PageMode , client_id:str, ws:WebSocket):
        connction = ConnectionStatus(client_id=client_id, ws=ws, page_mode=page_mode, setting_mode=setting_mode)
        if page_mode not in self.setting_client_ws[setting_mode]:
            dict = {
                PageMode.Setting: [],
                PageMode.Chat: []
            }
            self.setting_client_ws[setting_mode] = dict
        self.setting_client_ws[setting_mode][page_mode].append(connction)


    async def notify(self, message_dict:AppSettingsModel, setting_mode: str):
        """
        同じsetting_modeのws全てにメッセージを送信します。
        """
        connections = self.setting_client_ws[setting_mode]
        for ws in connections[PageMode.Setting]:
            await ws.ws.send_json(message_dict)
        for ws in connections[PageMode.Chat]:
            await ws.ws.send_json(message_dict)

    def setSetting(self, setting_mode:str, page_mode:PageMode, client_id:str, appSettingsModel:AppSettingsModel):
        """
        setting_dictをsetting_modeのjsonに保存し、対応するオブジェクトに反映します。
        """
        self.setting = appSettingsModel
        JsonAccessor.saveAppSettingTest(appSettingsModel)
        return appSettingsModel


    def loadSetting(self):
        return JsonAccessor.loadAppSetting()
    
    def saveSetting(self, setting):
        JsonAccessor.saveAppSetting(setting)

    def getInitSetting(self):
        return AppSettingsModel(
            コメント受信設定 = CommentReceiveSettingModel(
                ニコニコ生放送 =NiconicoLiveSettingModel(配信URL=""),
                YoutubeLive =YoutubeLiveSettingModel(配信URL=""),
                Twitch =TwitchSettingModel(配信URL="")
            )
        )




    

