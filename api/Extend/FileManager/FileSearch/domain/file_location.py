from pathlib import Path
from typing import Union

from api.Extend.FileManager.FileSearch.domain.drive import Drive

class FileLocation:
    def __init__(self, location: Path|Drive):
        self.path = location.value if isinstance(location, Drive) else location
        if not isinstance(self.path, Path):
            raise ValueError("location must be Path or Drive")

    def exists(self) -> bool:
        return self.path.exists()

    def __str__(self) -> str:
        return str(self.path)