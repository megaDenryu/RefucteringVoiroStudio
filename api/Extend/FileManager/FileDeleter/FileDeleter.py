import shutil
from pathlib import Path
from typing import Union

from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileDeleter.FileDeleteResult import FileDeleteResult

class FileDeleter:
    @staticmethod
    def delete_file(file_path: Path) -> FileDeleteResult:
        """
        ファイルを削除する
        """
        try:
            if file_path.is_file():
                file_path.unlink()
                return FileDeleteResult(file_path=file_path, is_delete_success=True, message="削除成功")
            return FileDeleteResult(file_path=file_path, is_delete_success=False, message="削除対象はファイルではありません")
        except Exception as e:
            ExtendFunc.ExtendPrint(f"ファイル削除エラー: {e}")
            return FileDeleteResult(file_path=file_path, is_delete_success=False, message=f"ファイル削除エラー: {e}")

    @staticmethod
    def delete_directory(dir_path: Path) -> FileDeleteResult:
        """
        ディレクトリを削除する。サブディレクトリも含めて削除。
        """
        try:
            if dir_path.is_dir():
                shutil.rmtree(dir_path)
                return FileDeleteResult(file_path=dir_path, is_delete_success=True, message="削除成功")
            return FileDeleteResult(file_path=dir_path, is_delete_success=False, message="削除対象はディレクトリではありません")
        except Exception as e:
            print(f"ディレクトリ削除エラー: {e}")
            return FileDeleteResult(file_path=dir_path, is_delete_success=False, message=f"ディレクトリ削除エラー: {e}")
        
    @staticmethod
    def まとめて削除(pathes:list[Path])->list[FileDeleteResult]:
        """
        複数のファイル、ディレクトリを削除する
        pathがファイルの場合はファイルを削除し、ディレクトリの場合はディレクトリ配下を再帰的に削除する
        """
        results:list[FileDeleteResult] = []
        for path in pathes:
            if path.is_file():
                results.append(FileDeleter.delete_file(path))
            elif path.is_dir():
                results.append(FileDeleter.delete_directory(path))
            else:
                print(f"削除対象が存在しません: {path}")
        return results
        