import json
from pathlib import Path
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
    AppSettings:PageModeList



class AppSettingModule:
    setting: AppSettingsModel
    file_path = ExtendFunc.api_dir / "AppSettingJson/app_setting_test.json"
    _instance: "AppSettingModule|None" = None
    def __init__(self):
        self.setting_client_ws:SettingClientWs = {
            "AppSettings":{
                "Setting":[],
                "Chat":[]
            }
        }
        # self.setting = AppSettingsModel(**self.loadSetting()) #型が違うのになんか動いてるので調べる
        self.fileCreate()
        self.setting = self.loadSetting()
        ExtendFunc.ExtendPrint(self.setting)

    @staticmethod
    def singleton():
        if AppSettingModule._instance is None:
            AppSettingModule._instance = AppSettingModule()
        return AppSettingModule._instance

    def addWs(self, setting_mode: SettingMode, page_mode:PageMode , client_id:str, ws:WebSocket):
        connction = ConnectionStatus(client_id=client_id, ws=ws, page_mode=page_mode, setting_mode=setting_mode)
        ExtendFunc.ExtendPrint(self.setting_client_ws, setting_mode)
        try:
            self.setting_client_ws[setting_mode][page_mode].append(connction)
        except KeyError:
            ExtendFunc.ExtendPrintWithTitle(f"setting_mode:{setting_mode} かつ page_mode:{page_mode} が存在しません。",self.setting_client_ws)

    def removeWs(self, setting_mode: SettingMode, page_mode:PageMode, client_id:str):
        try:
            connections = self.setting_client_ws[setting_mode]
        except KeyError:
            return
        for connectionStatus in connections[page_mode]:
            if connectionStatus.client_id == client_id:
                connections[page_mode].remove(connectionStatus)
                break


    async def notify(self, newAppSettingsModel:AppSettingsModel, setting_mode: SettingMode, page_mode: PageMode, client_id:str):
        """
        同じsetting_modeのws全てにメッセージを送信します。
        """
        try:
            ExtendFunc.ExtendPrint(self.setting_client_ws)
            connections = self.setting_client_ws[setting_mode]
        except KeyError:
            return
        # BaseModel を JSON 互換の形式に変換
        newAppSettingsModel_json = newAppSettingsModel.model_dump_json()

        for connectionStatus in connections[page_mode]:
            ExtendFunc.ExtendPrint(f"client_id:{connectionStatus.client_id} page_mode: {page_mode}に送信します。")
            if connectionStatus.client_id == client_id:
                ExtendFunc.ExtendPrint(f"client_id:{client_id} は送信元なのでスキップします。")
                continue
            await connectionStatus.ws.send_json(json.loads(newAppSettingsModel_json))

    def setSetting(self, setting_mode:SettingMode, page_mode:PageMode, client_id:str, appSettingsModel:AppSettingsModel):
        """
        setting_dictをsetting_modeのjsonに保存し、対応するオブジェクトに反映します。
        """
        ExtendFunc.ExtendPrint(self.setting)
        self.setting = appSettingsModel
        ExtendFunc.ExtendPrint(self.setting)
        self.saveSetting(self.setting)
        return appSettingsModel


    def loadSetting(self)->AppSettingsModel:
        try:
            data = JsonAccessor.loadJsonToBaseModel(self.file_path, AppSettingsModel)
            if data is None:
                return self.getInitSetting()
            return data
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            raise e
    
    def saveSetting(self, appSettingsModel:AppSettingsModel):
        ExtendFunc.saveBaseModelToJson(self.file_path, appSettingsModel)

    def getInitSetting(self):
        return AppSettingsModel(
            コメント受信設定 = CommentReceiveSettingModel(
                ニコニコ生放送 =NiconicoLiveSettingModel(配信URL=""),
                YoutubeLive =YoutubeLiveSettingModel(配信URL=""),
                Twitch =TwitchSettingModel(配信URL="")
            )
        )
    
    def fileCreate(self)->bool:
        try:
            # ファイルがあるかチェックする
            if not self.file_path.exists():
                # ファイルがなかったら作成する
                ExtendFunc.saveBaseModelToJson(self.file_path, self.getInitSetting())
            return True
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            return False
        
    
    def saveVoiceVoxPath(self, path:Path):
        self.setting.合成音声設定.VoiceVox設定.path = str(path)
        ExtendFunc.ExtendPrint(self.setting)
        self.saveSetting(self.setting)
    
    def saveCoeiroinkPath(self, path:Path):
        self.setting.合成音声設定.COEIROINKv2設定.path = str(path)
        ExtendFunc.ExtendPrint(self.setting)
        self.saveSetting(self.setting)

    def saveニコ生URL(self, url:str):
        self.setting.コメント受信設定.ニコニコ生放送.配信URL = url
        ExtendFunc.ExtendPrint(self.setting)
        self.saveSetting(self.setting)

