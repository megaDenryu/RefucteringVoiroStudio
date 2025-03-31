from pathlib import Path
import json

from api.Extend.FileManager.FileProxy.ファイル作成用オブジェクト.Interaface.I作成するファイル import I作成するファイル

class JsonFile(I作成するファイル):
    _path:Path
    content: dict
    def __init__(self, path:Path ,content: dict = {}):
        if not self.validate_extension(path):
            raise ValueError(f"不正なファイル拡張子です: {path.suffix} , 可能な拡張子: .json")
        self._path = path
        self.content = content
    
    @property
    def path(self) -> Path:
        return self._path
        
    def save(self) -> bool:
        try:
            with open(self._path, 'w', encoding='utf-8') as f:
                json.dump(self.content, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"JSONファイル保存エラー: {e}")
            return False
            
    def validate_extension(self, path: Path) -> bool:
        return path.suffix.lower() == '.json'