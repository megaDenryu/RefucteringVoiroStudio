import asyncio
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import List

# 仮定: IFileName と FileLocation は別のモジュールからインポート
from api.Extend.FileManager.FileSearch.domain.File.file_interface import IFileName
from api.Extend.FileManager.FileSearch.domain.file_location import FileLocation

class FileSearcher:
    async def searchFile(self, location: FileLocation, file: IFileName) -> Path | None:
        if not location.exists():
            print(f"{location} が見つかりません")
            return None

        def searchSync() -> Path | None:
            for file_path in location.path.rglob(file.name):
                try:
                    # 各ファイルパスに対して個別にエラーチェック
                    if file_path.exists() and file.check_extension(file_path.name):
                        return file_path
                except PermissionError:
                    print(f"アクセス権限エラー: {file_path}")
                    continue  # エラーをスキップして次へ
                except OSError as e:
                    print(f"OSエラー: {file_path} - {e}")
                    continue  # シンボリックリンクエラーなどもスキップ
                except Exception as e:
                    print(f"その他のエラー: {file_path} - {e}")
                    continue  # その他のエラーもスキップ
            return None

        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            return await loop.run_in_executor(pool, searchSync)

    async def searchFileInLocations(self, locations: List[FileLocation], file: IFileName) -> Path | None:
        tasks = [self.searchFile(loc, file) for loc in locations]
        results = await asyncio.gather(*tasks)
        return next((result for result in results if result is not None), None)