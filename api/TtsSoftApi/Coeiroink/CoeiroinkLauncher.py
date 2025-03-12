
import os
import subprocess

import psutil
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileSearch.domain.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.domain.LaunchResult import LaunchResult
from api.Extend.FileManager.FileSearch.util.launch_utils import LaunchUtils
from api.TtsSoftApi.Coeiroink.CoeiroinkHuman import Coeiroink
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState


class CoeiroinkLauncher:
    @staticmethod
    async def startCoeiroink()->"Coeiroink":
        tmp_human = Coeiroink(None,0)

        coeiroink_exe_path = CoeiroinkLauncher.find_coeiroink_exe_path()
        ExtendFunc.ExtendPrint(coeiroink_exe_path)

        if coeiroink_exe_path is None:
            result = await LaunchUtils.launchExe(ExeFileName("COEIROINKv2.exe"))
            print(result.message)
            if result.exec_success == LaunchResult.exec_success.SUCCESS:
                tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
                tmp_human.onTTSSoftware = True
                CoeiroinkLauncher.saveCoeiroinkPath(result.file_path.__str__())
                return tmp_human


        if coeiroink_exe_path is None:
            print("Coeiroinkのインストール場所が見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human
        
        CoeiroinkLauncher.saveCoeiroinkPath(coeiroink_exe_path)

        try:
            # 非同期でプロセスを起動
            subprocess.Popen([coeiroink_exe_path])
            print("Coeiroinkが正常に起動しました。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            return tmp_human
        except Exception as e:
            print(f"Coeiroinkの起動に失敗しました: {e}")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = False
            return tmp_human
        
    @staticmethod
    def find_coeiroink_exe_path():
        defalut_exe_name = "COEIROINKv2.exe"
        retPath:str = JsonAccessor.loadAppSetting()["COEIROINKv2設定"]["path"]
        # 存在していてpathが正しいかチェック
        if retPath != "" and os.path.exists(retPath):
            return retPath
        
        # 見つからなかった場合は検索

        try:
            # ユーザーのダウンロードフォルダを優先的に検索
            download_folder = os.path.join(os.path.expanduser("~"), "Downloads")
            for root, dirs, files in os.walk(download_folder):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)
            
            # Cドライブ全体から検索
            for root, dirs, files in os.walk("C:\\"):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)

            # Dドライブ全体から検索
            for root, dirs, files in os.walk("D:\\"):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)


            #pc全体の中からCOEIROINKv2.exeを探す
            for drive in psutil.disk_partitions():
                if os.path.isdir(drive.device):
                    for root, dirs, files in os.walk(drive.device):
                        if defalut_exe_name in files:
                            return root
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            return None
        
    @staticmethod
    def saveCoeiroinkPath(path:str):
        app_setting = JsonAccessor.loadAppSetting()
        app_setting["COEIROINKv2設定"]["path"] = path
        JsonAccessor.saveAppSetting(app_setting)

        # 下は多分無理
        # appSetting = AppSettingModule()
        # appSetting.setting.合成音声設定.COEIROINKv2設定.path = path