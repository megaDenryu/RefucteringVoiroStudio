from pathlib import Path
from typing import Optional
from api.Extend.ExtendFunc import ExtendFunc

class DataDir:
    _instance: Optional['DataDir'] = None
    api_dir: Path # api_dir配下
    
    AppSettingJson: Path # AppSettingJson配下
    CharacterDestination: Path
    CharcterAISetting: Path
    GPTBehavior: Path
    InitMemory: Path
    VoiceRoidDefaultSettings: Path
    
    CharSettingJson: Path # CharSettingJson配下
    CharaNames: Path
    CharaNames2Voice: Path
    VoiceModeNames: Path

    LogJson: Path # LogJson配下
    
    def __init__(self) -> None:
        if DataDir._instance is not None:
            raise RuntimeError("DataDirのインスタンス化は singleton() メソッドを使用してください")
        
        self.api_dir = ExtendFunc.api_dir # api_dir配下

        self.AppSettingJson = self.api_dir / "AppSettingJson"  # AppSettingJson配下
        self.CharacterDestination = self.AppSettingJson / "CharacterDestination"
        self.CharcterAISetting = self.AppSettingJson / "CharcterAISetting"
        self.GPTBehavior = self.AppSettingJson / "GPTBehavior"
        self.InitMemory = self.AppSettingJson / "InitMemory"
        self.VoiceRoidDefaultSettings = self.AppSettingJson / "VoiceRoidDefaultSettings"

        self.CharSettingJson = self.api_dir / "CharSettingJson" # CharSettingJson配下
        self.CharaNames = self.CharSettingJson / "CharaNames"
        self.CharaNames2VoiceMode = self.CharSettingJson / "CharaNames2VoiceMode"
        self.VoiceModeNames = self.CharSettingJson / "VoiceModeNames"

        self.LogJson = self.api_dir / "LogJson" # LogJson配下
        
        # self._initialize_directories()
    def checkPrint(self):
        ExtendFunc.ExtendPrint(self.api_dir)
        ExtendFunc.ExtendPrint(self.AppSettingJson)
        ExtendFunc.ExtendPrint(self.CharacterDestination)
        ExtendFunc.ExtendPrint(self.CharcterAISetting)
        ExtendFunc.ExtendPrint(self.GPTBehavior)
        ExtendFunc.ExtendPrint(self.InitMemory)
        ExtendFunc.ExtendPrint(self.VoiceRoidDefaultSettings)
        ExtendFunc.ExtendPrint(self.CharSettingJson)
        ExtendFunc.ExtendPrint(self.CharaNames)
        ExtendFunc.ExtendPrint(self.CharaNames2VoiceMode)
        ExtendFunc.ExtendPrint(self.VoiceModeNames)
    
    def _initialize_directories(self) -> None:
        """必要なディレクトリを作成します"""
        self.AppSettingJson.mkdir(parents=True, exist_ok=True)
        self.CharSettingJson.mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def _(cls) -> 'DataDir':
        """シングルトンインスタンスを取得します"""
        if cls._instance is None:
            cls._instance = DataDir()
        return cls._instance
    
    @classmethod
    def reset(cls) -> None:
        """シングルトンインスタンスをリセットします（主にテスト用）"""
        cls._instance = None