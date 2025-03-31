from pathlib import Path
from typing import TypeVar
from pydantic import BaseModel

from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.Extend.FileManager.Domain.ファイル作成.Files.TextFile import TextFile
from api.Extend.FileManager.FileCreater.FileCreater import FileCreater

T = TypeVar("T", bound=BaseModel)
class MarkdownConverter:
    def __init__(self, indent_spaces: int = 2) -> None:
        """初期化メソッド。インデントの幅をカスタマイズ可能。"""
        self.indent_spaces: int = indent_spaces

    def convert(self, model: BaseModel, indent_level: int = 0) -> str:
        """BaseModelをマークダウン形式の文字列に変換する。"""
        if not hasattr(model, '__dict__'):
            return str(model)
        
        markdown_lines: list[str] = []
        indent: str = " " * (self.indent_spaces * indent_level)
        
        for key, value in model.__dict__.items():
            if value is None:
                markdown_lines.append(f"{indent}- **{key}**: None")
            elif hasattr(value, '__dict__'):
                markdown_lines.append(f"{indent}- **{key}**:")
                nested_content: str = self.convert(value, indent_level + 1)
                markdown_lines.append(nested_content)
            elif isinstance(value, list):
                markdown_lines.append(f"{indent}- **{key}**:")
                for i, item in enumerate(value):
                    if hasattr(item, '__dict__'):
                        nested_content: str = self.convert(item, indent_level + 1)
                        markdown_lines.append(f"{indent}  - Item {i + 1}:")
                        markdown_lines.append(nested_content)
                    else:
                        markdown_lines.append(f"{indent}  - {item}")
            else:
                markdown_lines.append(f"{indent}- **{key}**: {value}")
        
        文字列 = "\n".join(markdown_lines)
        return 文字列
    
    def joinListConvert(self, model: list[T], indent_level: int = 0) -> str:
        """BaseModelをマークダウン形式の文字列に変換する。"""
        markdown_lines: list[str] = []
        indent: str = " " * (self.indent_spaces * indent_level)
        
        for i, item in enumerate(model):
            if hasattr(item, '__dict__'):
                nested_content: str = self.convert(item, indent_level + 1)
                markdown_lines.append(f"# {indent}Item {i + 1}: {TimeExtend()}")
                markdown_lines.append(nested_content)
            else:
                markdown_lines.append(f"{indent}- {item}")
        
        文字列 = "\n".join(markdown_lines)
        return 文字列