import json
from typing import TypedDict
from typing_extensions import Literal
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
from api.Extend.ExtendFunc import ExtendFunc

PageMode = Literal["Setting", "Chat"]
SettingMode = Literal["AppSettings"]

class ConnectionStatus:
    client_id: str
    ws: WebSocket
    page_mode: PageMode
    setting_mode: SettingMode
    def __init__(self, client_id: str, ws: WebSocket, page_mode: PageMode, setting_mode: SettingMode):
        self.client_id = client_id
        self.ws = ws
        self.page_mode = page_mode
        self.setting_mode = setting_mode

class PageModeList(TypedDict):
    Setting: list[ConnectionStatus]
    Chat: list[ConnectionStatus]

class SettingClientWs(TypedDict):
    AppSetting:PageModeList



class AppSettingModule:
    def __init__(self):
        self.setting_client_ws:SettingClientWs = {
            "AppSettings":{
                "Setting":[],
                "Chat":[]
            }
        }
        self.setting = self.loadSetting()

    def addWs(self, setting_mode: SettingMode, page_mode:PageMode , client_id:str, ws:WebSocket):
        connction = ConnectionStatus(client_id=client_id, ws=ws, page_mode=page_mode, setting_mode=setting_mode)
        ExtendFunc.ExtendPrint(self.setting_client_ws, setting_mode)
        try:
            self.setting_client_ws[setting_mode][page_mode].append(connction)
        except KeyError:
            ExtendFunc.ExtendPrintWithTitle(f"setting_mode:{setting_mode} かつ page_mode:{page_mode} が存在しません。",self.setting_client_ws)

    def removeWs(self, setting_mode: SettingMode, page_mode:PageMode, client_id:str):
        try:
            connections:dict[PageMode, list[ConnectionStatus]] = self.setting_client_ws[setting_mode]
        except KeyError:
            return
        for connectionStatus in connections[page_mode]:
            if connectionStatus.client_id == client_id:
                connections[page_mode].remove(connectionStatus)
                break


    async def notify(self, newAppSettingsModel:AppSettingsModel, setting_mode: str):
        """
        同じsetting_modeのws全てにメッセージを送信します。
        """
        try:
            ExtendFunc.ExtendPrint(self.setting_client_ws)
            connections:dict[PageMode, list[ConnectionStatus]] = self.setting_client_ws[setting_mode]
        except KeyError:
            return
        # BaseModel を JSON 互換の形式に変換
        newAppSettingsModel_json = newAppSettingsModel.model_dump_json()

        for connectionStatus in connections["Setting"]:
            await connectionStatus.ws.send_json(json.loads(newAppSettingsModel_json))
        for connectionStatus in connections["Chat"]:
            await connectionStatus.ws.send_json(json.loads(newAppSettingsModel_json))

    def setSetting(self, setting_mode:SettingMode, page_mode:PageMode, client_id:str, appSettingsModel:AppSettingsModel):
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




    

