import winreg

"""
まだ検討中のテストコード
"""
def get_exe_path_from_registry(exe_name):
    # 一般的なレジストリの場所を定義
    registry_locations = [
        (winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths"),
        (winreg.HKEY_CURRENT_USER, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths"),
        (winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\App Paths"),
        (winreg.HKEY_CURRENT_USER, "SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\App Paths"),
    ]
    
    try:
        for hive, subkey in registry_locations:
            # レジストリキーオープン
            key = winreg.OpenKey(hive, subkey, 0, winreg.KEY_READ)
            try:
                # exe名を指定して値を取得
                path = winreg.QueryValue(key, exe_name)
                return path
            except WindowsError:
                continue
            finally:
                winreg.CloseKey(key)
    except WindowsError as e:
        return f"エラー: {str(e)}"
    
    return None

# 使用例
# exe_name = "COEIROINKv2.exe"  # 検索したいEXEファイル名
exe_name = "VOICEVOX.exe"
path = get_exe_path_from_registry(exe_name)
if path:
    print(f"{exe_name} のパス: {path}")
else:
    print(f"{exe_name} が見つかりませんでした")