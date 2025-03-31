import asyncio
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator, List

# 仮定: IFileName と FileLocation は別のモジュールからインポート
from api.Extend.FileManager.FileSearch.FileDirectoryProxy.File.file_interface import IFileName
from api.Extend.FileManager.FileSearch.FileDirectoryProxy.file_location import FileLocation

class FileSearcher:
    async def searchFile(self, location: FileLocation, file: IFileName) -> Path | None:
        if not location.exists():
            print(f"{location} が見つかりません")
            return None

        def searchSyncOld() -> Path | None:
            try:
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
            except FileNotFoundError:
                print(f"パスが見つかりません: {location.path}")
                return None
            except PermissionError:
                print(f"ディレクトリへのアクセス権限がありません: {location.path}")
                return None
            except Exception as e:
                print(f"検索中にエラーが発生しました: {e}")
                return None
            return None

        def searchSync部分一致() -> Path | None:
            def safe_scan(path: Path) -> Iterator[Path]:
                try:
                    # ディレクトリの内容を安全に走査
                    with os.scandir(path) as entries:
                        for entry in entries:
                            try:
                                entry_path = Path(entry.path)
                                if entry.is_file():
                                    if file.check_extension(entry.name) and file.name.lower() in entry.name.lower():
                                        yield entry_path
                                elif entry.is_dir():
                                    yield from safe_scan(entry_path)
                            except (PermissionError, OSError) as e:
                                print(f"エントリーのスキップ: {entry.path} - {e}")
                                continue
                except (PermissionError, OSError) as e:
                    print(f"ディレクトリのスキップ: {path} - {e}")
                    return

            try:
                for found_path in safe_scan(location.path):
                    return found_path
                return None
            except Exception as e:
                print(f"検索中にエラーが発生: {e}")
                return None
            
        def searchSync完全一致() -> Path | None:
            def safe_scan(path: Path) -> Iterator[Path]:
                try:
                    # ディレクトリの内容を安全に走査
                    with os.scandir(path) as entries:
                        for entry in entries:
                            try:
                                entry_path = Path(entry.path)
                                if entry.is_file():
                                    if file.check_extension(entry.name) and entry.name.lower() == file.name.lower():
                                        yield entry_path
                                elif entry.is_dir():
                                    yield from safe_scan(entry_path)
                            except (PermissionError, OSError) as e:
                                print(f"エントリーのスキップ: {entry.path} - {e}")
                                continue
                except (PermissionError, OSError) as e:
                    print(f"ディレクトリのスキップ: {path} - {e}")
                    return

            try:
                for found_path in safe_scan(location.path):
                    return found_path
                return None
            except Exception as e:
                print(f"検索中にエラーが発生: {e}")
                return None
        
        
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            return await loop.run_in_executor(pool, searchSync完全一致)

    async def searchFileInLocations(self, locations: List[FileLocation], file: IFileName) -> Path | None:
        tasks = [self.searchFile(loc, file) for loc in locations]
        results = await asyncio.gather(*tasks)
        return next((result for result in results if result is not None), None)