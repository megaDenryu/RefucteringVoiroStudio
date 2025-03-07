import os
import subprocess
import winreg

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
    def startVoicevox()->VoiceVoxHuman:
        tmp_human = VoiceVoxHuman(None,0)
        voicevox_path = VoiceVoxLauncher.find_voicevox_path()
        if voicevox_path is None:
            username = os.getenv("USERNAME")
            # 既知のパスをチェック
            known_paths = [
                "C://Program Files//VOICEVOX//",
                f"C:\\Users\\{username}\\AppData\\Local\\Programs\\VOICEVOX\\VOICEVOX.exe",
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

        voicevox_exe_path = os.path.join(voicevox_path, "VOICEVOX.exe")
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