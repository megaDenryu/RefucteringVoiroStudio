from pathlib import Path
from api.Extend.FileManager.Domain.ファイル作成用オブジェクト.Interaface.I作成するファイル import I作成するファイル
from api.Extend.FileManager.Domain.ファイル作成用オブジェクト.Interaface.SaveConfig import SaveConfigEnum

class TextFile(I作成するファイル):
    _path: Path
    content: str
    allow_extensions = ['.txt', '.log', '.md']
    saveConfig:SaveConfigEnum
    def __init__(self, path:Path , content: str, saveConfig:SaveConfigEnum):
        if not self.validate_extension(path):
            raise ValueError(f"不正なファイル拡張子です: {path.suffix} , 可能な拡張子: {self.allow_extensions}")
        self._path = path
        self.content = content
        self.saveConfig = saveConfig
    
    @property
    def path(self) -> Path:
        return self._path
        
    def save(self) -> bool:
        try:
            if self.saveConfig == SaveConfigEnum.上書き:
                self._path.write_text(self.content, encoding='utf-8')
            elif self.saveConfig == SaveConfigEnum.追記:
                # ファイル末尾に追記する
                with self._path.open(mode='a', encoding='utf-8') as f:
                    f.write(self.content)
            return True
        except Exception as e:
            print(f"テキストファイル保存エラー: {e}")
            return False
            
    def validate_extension(self, path: Path) -> bool:
        return path.suffix.lower() in self.allow_extensions