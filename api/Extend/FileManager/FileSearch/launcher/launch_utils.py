from pathlib import Path

from api.Extend.FileManager.FileSearch.domain.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.domain.LaunchResult import LaunchResult
from api.Extend.FileManager.FileSearch.domain.drive import Drive
from api.Extend.FileManager.FileSearch.domain.file_location import FileLocation
from api.Extend.FileManager.FileSearch.searcher.file_searcher import FileSearcher
from api.Extend.FileManager.FileSearch.launcher.file_launcher import FileLauncher


#ExeFileName("VOICEVOX.exe")
class LaunchUtils:
    @staticmethod
    async def launchExeSpecificLocations(exe:ExeFileName) -> LaunchResult:
        searcher = FileSearcher()
        launcher = FileLauncher(searcher)
        locations = [
            FileLocation(Drive.C),
            FileLocation(Drive.D),
            FileLocation(Path("C:/Users/userName/AppData/Local/Programs")),
        ]
        return await launcher.findLaunch(locations, exe)

    @staticmethod
    async def launchExe(exe:ExeFileName) -> LaunchResult:
        searcher = FileSearcher()
        launcher = FileLauncher(searcher)
        locations = LaunchUtils.getAvailableDriveLocations()
        return await launcher.findLaunch(locations, exe)

    @staticmethod
    async def launchExeInSpecificLocation(exe:ExeFileName, location: FileLocation) -> LaunchResult:
        searcher = FileSearcher()
        launcher = FileLauncher(searcher)
        return await launcher.findLaunch([location], exe)

    @staticmethod
    def getAvailableDriveLocations() -> list[FileLocation]:
        available_drives = [FileLocation(drive) for drive in Drive if drive.value.exists()]
        print(f"利用可能なドライブ: {[str(loc) for loc in available_drives]}")
        return available_drives
    
    @staticmethod
    async def searchFileInLocation(exe:ExeFileName) -> Path | None:
        searcher = FileSearcher()
        locations = LaunchUtils.getAvailableDriveLocations()
        return await searcher.searchFileInLocations(locations, exe)
    
    