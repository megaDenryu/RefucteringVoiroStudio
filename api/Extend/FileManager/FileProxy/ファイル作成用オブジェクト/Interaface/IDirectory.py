from abc import ABC, abstractmethod
from pathlib import Path

class IDirectory(ABC):
    @abstractmethod
    def create(self, path: Path) -> bool:
        """ディレクトリを作成する"""
        pass