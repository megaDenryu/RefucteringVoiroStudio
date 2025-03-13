import asyncio
from pathlib import Path
import subprocess
import winreg
import os
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule
from api.Extend.FileManager.FileSearch.domain.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.domain.LaunchResult import ExecSuccess, LaunchResult
from api.Extend.FileManager.FileSearch.util.launch_utils import LaunchUtils
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState
from api.TtsSoftApi.VoiceVox.VoiceVoxHuman import VoiceVoxHuman


class VoiceVoxLauncher:
    @staticmethod
    def find_voicevox_path():
        try:
            # レジストリキーを開く
            reg_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\VOICEVOX")
            # インストールパスを取得
            voicevox_path, _ = winreg.QueryValueEx(reg_key, "InstallPath")
            winreg.CloseKey(reg_key)
            return voicevox_path
        except FileNotFoundError:
            return None

    

    @staticmethod
    async def startVoicevox()->VoiceVoxHuman:

        tmp_human = VoiceVoxHuman(None,0)
        username = os.getenv("USERNAME")

        savedPath = AppSettingModule.singleton().setting.合成音声設定.VoiceVox設定.path
        if savedPath != "":
            if os.path.exists(savedPath):
                try:
                    # 非同期でプロセスを起動
                    subprocess.Popen([savedPath])
                    print("VoiceVoxが正常に起動しました。")
                    tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
                    tmp_human.onTTSSoftware = True
                    return tmp_human
                except Exception as e:
                    print(f"VoiceVoxの起動に失敗しました: {e}")


        #　ショートカットから起動
        try:
            # ショートカットのパス（実際のユーザー名に置き換えてください）
            shortcut_path = Path(f"C:\\Users\\{username}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\VOICEVOX.lnk")
            # ショートカットを起動
            os.startfile(shortcut_path)
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            AppSettingModule.singleton().saveVoiceVoxPath(shortcut_path)
            return tmp_human
        except Exception as e:
            print(f"VoiceVoxのショートカット起動に失敗しました: {e}")
        
        result = await LaunchUtils.launchExe(ExeFileName("VOICEVOX.exe"))
        print(result.message)
        if result.exec_success == ExecSuccess.SUCCESS and result.file_path is not None:
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            AppSettingModule.singleton().saveVoiceVoxPath(result.file_path)
            return tmp_human
        else:
            if result.file_path is None:
                tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
                tmp_human.onTTSSoftware = False
                return tmp_human
            else:
                tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
                tmp_human.onTTSSoftware = False

                

        # ショートカットがない場合はexeファイルから起動
        voicevox_path = VoiceVoxLauncher.find_voicevox_path()
        if voicevox_path is None:
            # 既知のパスをチェック
            known_paths = [
                Path("C://Program Files//VOICEVOX//"),
                Path(f"C:\\Users\\{username}\\AppData\\Local\\Programs\\VOICEVOX\\"),
            ]
            for path in known_paths:
                if os.path.exists(path):
                    voicevox_path = path
                    break

        if voicevox_path is None:
            print("VoiceVoxのインストール場所が見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human
        
        voicevox_exe_path = voicevox_path / "VOICEVOX.exe"
        if not os.path.exists(voicevox_exe_path):
            print("VoiceVoxのexeファイルが見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human

        try:
            # 非同期でプロセスを起動
            subprocess.Popen([voicevox_exe_path])
            print("VoiceVoxが正常に起動しました。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            return tmp_human
        except Exception as e:
            print(f"VoiceVoxの起動に失敗しました: {e}")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = False
            return tmp_human