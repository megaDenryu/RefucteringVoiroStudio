from abc import ABC, abstractmethod
from pathlib import Path


class IFileオペレーター(ABC):
    """
    ファイル操作用オブジェクトインターフェース
    """
    @property
    @abstractmethod
    def path(self) -> Path:
        pass

    @abstractmethod
    def load(self) -> str:
        """
        ファイルを読み込む
        """
        pass

    @abstractmethod
    def update(self, content: str) -> None:
        """
        ファイルを上書き
        """
        pass

    @abstractmethod
    def insert(self, content: str) -> None:
        """
        ファイルに追記
        """
        pass
    