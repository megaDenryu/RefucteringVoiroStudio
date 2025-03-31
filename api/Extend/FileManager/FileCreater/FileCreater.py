from pathlib import Path
from typing import Union

from api import Extend
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileProxy.ファイル作成用オブジェクト.Interaface.I作成するファイル import I作成するファイル
from api.Extend.FileManager.FileCreater.FileCreateResult import FileCreateResult

class FileCreater:
    @staticmethod
    def create_file(file: I作成するファイル) -> FileCreateResult:
        """
        ファイルを作成する
        """
        try:    
            file.path.parent.mkdir(parents=True, exist_ok=True)
            if file.save():
                return FileCreateResult(
                    file_path=file.path,
                    is_create_success=True,
                    message="作成成功"
                )
            return FileCreateResult(
                file_path=file.path,
                is_create_success=False,
                message="保存に失敗しました"
            )
        except Exception as e:
            return FileCreateResult(
                file_path=file.path,
                is_create_success=False,
                message=f"ファイル作成エラー: {e}"
            )
    
    @staticmethod
    def create_directory(dir: Path) -> FileCreateResult:
        """
        ディレクトリを作成する
        """
        try:
            dir.mkdir(parents=True, exist_ok=True)
            return FileCreateResult(
                file_path=dir,
                is_create_success=True,
                message="作成成功"
            )
        except Exception as e:
            return FileCreateResult(
                file_path=dir,
                is_create_success=False,
                message=f"ディレクトリ作成エラー: {e}"
            )
        
    @staticmethod
    def まとめて作成(files: list[I作成するファイル|Path]) -> list[FileCreateResult]:
        """
        複数のファイルを作成する
        contentsは(パス, ファイルオブジェクト)のタプルのリスト
        """
        result_list = []
        for file in files:
            if isinstance(file, I作成するファイル):
                result_list.append(FileCreater.create_file(file))
            elif isinstance(file, Path):
                result_list.append(FileCreater.create_directory(file))
            else:
                raise ValueError("不正なファイルオブジェクトです")
        ExtendFunc.ExtendPrint(result_list)
        return result_list
    
