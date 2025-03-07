import subprocess
from api.Extend.FileManager.FileSearch.domain.File.file_interface import IFileName
from api.Extend.FileManager.FileSearch.domain.LaunchResult import ExecSuccess, LaunchResult
from api.Extend.FileManager.FileSearch.domain.file_location import FileLocation
from api.Extend.FileManager.FileSearch.repository.file_searcher import FileSearcher



class FileLauncher:
    def __init__(self, searcher: FileSearcher):
        self.searcher = searcher

    async def findLaunch(self, locations: list[FileLocation], filename: IFileName) -> LaunchResult:
        file_path = await self.searcher.searchFileInLocations(locations, filename)
        if file_path:
            print(f"見つかりました: {file_path}")
            try:
                subprocess.Popen([str(file_path)])
                print(f"{filename} を起動しました")
                return LaunchResult(file_path=file_path, exec_success=ExecSuccess.SUCCESS, message=f"{filename} を起動しました")
            except Exception as e:
                print(f"起動に失敗しました: {e}")
                return LaunchResult(file_path=file_path, exec_success=ExecSuccess.FAILED, message=f"起動に失敗しました: {e}")
        else:
            print(f"{filename} は指定した場所に見つかりませんでした")
            return LaunchResult(file_path=None, exec_success=ExecSuccess.FAILED, message=f"{filename} は指定した場所に見つかりませんでした")
            
