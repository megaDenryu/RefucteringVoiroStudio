import asyncio
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from api.Extend.FileManager.FileSearch.domain.File.file_interface import IFileName
from api.Extend.FileManager.FileSearch.domain.file_location import FileLocation

class FileSearcher:
    async def searchFile(self, location: FileLocation, file: IFileName) -> Path|None:
        if not location.exists():
            print(f"{location} が見つかりません")
            return None

        def searchSync() -> Path|None:
            try:
                for file_path in location.path.rglob(file.name):
                    return file_path
                return None
            except PermissionError:
                return None
            except Exception as e:
                print(f"{location} の検索中にエラーが発生: {e}")
                return None

        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            return await loop.run_in_executor(pool, searchSync)

    async def searchFileInLocations(self, locations: list[FileLocation], file: IFileName) -> Path|None:
        tasks = [self.searchFile(loc, file) for loc in locations]
        results = await asyncio.gather(*tasks)
        return next((result for result in results if result is not None), None)