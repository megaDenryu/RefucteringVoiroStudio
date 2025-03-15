
from pathlib import Path
from pydantic import BaseModel
from api.AppInitializer.アプリステータス import Eアプリ進行ステータス
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileCreater.FileCreater import FileCreater
from api.Extend.FileManager.FileDeleter.FileDeleter import FileDeleter
from api.images.image_manager.HumanPart import HumanPart

class アプリ起動確認結果(BaseModel):
    success: bool
    message: str


class アプリ起動確認者:
    mアプリ進行ステータス: Eアプリ進行ステータス
    def __init__(self):
        self.mアプリ進行ステータス = self._アプリ状況確認()
    def アプリ起動確認(self) -> アプリ起動確認結果:
        if self.mアプリ進行ステータス == Eアプリ進行ステータス.初起動前:
            return self._初めからの時の初期チェック()
        elif self.mアプリ進行ステータス == Eアプリ進行ステータス.一度起動したことがある:
            return self._一度起動したことがある時の初期チェック()
        else:
            return アプリ起動確認結果(success=False, message="アプリ起動確認に失敗しました")
    
    def _アプリ状況確認(self) -> Eアプリ進行ステータス:
        return Eアプリ進行ステータス.初起動前
    def _初めからの時の初期チェック(self)-> アプリ起動確認結果:
        a = AppSettingModule()
        a.fileCreate()
        HumanPart.initalCheck()
        return アプリ起動確認結果(success=True, message="初めての起動です")
    def _一度起動したことがある時の初期チェック(self) -> アプリ起動確認結果:
        HumanPart.initalCheck()
        return アプリ起動確認結果(success=True, message="一度起動したことがあります")
    
    def 初期化(self):
        FileDeleter.まとめて削除([
            ExtendFunc.api_dir / "AppSettingJson/app_setting_test.json",
            DataDir._().CharSettingJson
        ])
        FileCreater.まとめて作成([
            DataDir._().CharSettingJson
        ])