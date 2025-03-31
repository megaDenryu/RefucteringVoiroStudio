
import os
from pathlib import Path
import subprocess

import psutil
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileSearch.FileDirectoryProxy.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.launcher.LaunchResult import ExecSuccess, LaunchResult
from api.Extend.FileManager.FileSearch.launcher.launch_utils import LaunchUtils
from api.TtsSoftApi.Coeiroink.CoeiroinkHuman import Coeiroink
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState


class CoeiroinkLauncher:
    @staticmethod
    async def startCoeiroink()->Coeiroink:
        tmp_human = Coeiroink(None,0)

        savedPath = AppSettingModule.singleton().setting.合成音声設定.COEIROINKv2設定.path
        if savedPath != "":
            if os.path.exists(savedPath):
                try:
                    # 非同期でプロセスを起動
                    subprocess.Popen([savedPath])
                    print("VoiceVoxが正常に起動しました。")
                    tmp_human._hasTTSSoftware = TTSSoftwareInstallState.Installed
                    tmp_human._onTTSSoftware = True
                    return tmp_human
                except Exception as e:
                    print(f"VoiceVoxの起動に失敗しました。検索を開始します: {e}")

        result = await LaunchUtils.launchExe(ExeFileName("COEIROINKv2.exe"))
        if result.exec_success == ExecSuccess.SUCCESS and result.file_path is not None:
            tmp_human._hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human._onTTSSoftware = True
            AppSettingModule.singleton().saveCoeiroinkPath(result.file_path)
            return tmp_human
        else:
            if result.file_path is None:
                tmp_human._hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
                tmp_human._onTTSSoftware = False
                return tmp_human
            else:
                tmp_human._hasTTSSoftware = TTSSoftwareInstallState.Installed
                tmp_human._onTTSSoftware = False
                return tmp_human
        