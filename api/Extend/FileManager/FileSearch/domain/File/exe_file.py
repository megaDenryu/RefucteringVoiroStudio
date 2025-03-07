from api.Extend.FileManager.FileSearch.domain.File.file_interface import IFileName


class ExeFileName(IFileName):
    def __init__(self, file_name: str):
        if self.check_extension(file_name):
            self.file_name = file_name
        else:
            raise ValueError("拡張子がexeではありません")
    def check_extension(self, file_name: str) -> bool:
        return file_name.endswith(".exe")
    
    @property
    def name(self) -> str:
        return self.file_name