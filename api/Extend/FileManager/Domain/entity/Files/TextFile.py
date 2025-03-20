from pathlib import Path
from api.Extend.FileManager.Domain.entity.Interaface.IFile import IFile

class TextFile(IFile):
    _path: Path
    content: str
    allow_extensions = ['.txt', '.log', '.md']
    def __init__(self, path:Path , content: str):
        if not self.validate_extension(path):
            raise ValueError(f"不正なファイル拡張子です: {path.suffix} , 可能な拡張子: {self.allow_extensions}")
        self._path = path
        self.content = content
    
    @property
    def path(self) -> Path:
        return self._path
        
    def save(self) -> bool:
        try:
            self._path.write_text(self.content, encoding='utf-8')
            return True
        except Exception as e:
            print(f"テキストファイル保存エラー: {e}")
            return False
            
    def validate_extension(self, path: Path) -> bool:
        return path.suffix.lower() in self.allow_extensions