

from pathlib import Path
from typing import TypeVar
from pydantic import BaseModel

from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.Domain.ファイル作成.Files.TextFile import TextFile
from api.Extend.FileManager.Domain.ファイル作成.Interaface.SaveConfig import SaveConfigEnum
from api.Extend.FileManager.FileCreater.FileCreater import FileCreater
from api.Extend.FormatConverter import BaseModel2MD

T = TypeVar("T", bound=BaseModel)
class ConvertAndSaveLog:
    @staticmethod
    def MarkdownConvert(model: BaseModel, indent_level: int = 0 , log: bool = True) -> str:
        c = BaseModel2MD.MarkdownConverter()
        文字列 = c.convert(model,indent_level)
        if log:
            filepath: Path = ExtendFunc.api_dir / "memo/md_log" / model.__repr_name__() / f"{model.__repr_name__()}.md"
            mdFile = TextFile(filepath, 文字列, SaveConfigEnum.追記)
            FileCreater.まとめて作成([mdFile])
        return 文字列
    
    @staticmethod
    def MarkdownConvertList(model: list[T], indent_level: int = 0, log: bool = True) -> str:
        c = BaseModel2MD.MarkdownConverter()
        文字列 = c.joinListConvert(model,indent_level)
        filepath: Path = ExtendFunc.api_dir / "memo/md_log" / model[0].__repr_name__() / f"{model[0].__repr_name__()}.md"
        mdFile = TextFile(filepath, 文字列, SaveConfigEnum.追記)
        if log:
            FileCreater.まとめて作成([mdFile])
        return 文字列