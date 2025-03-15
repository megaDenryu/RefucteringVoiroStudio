from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

class IFile(ABC):
    @property
    @abstractmethod
    def path(self) -> Path:
        """ファイルパス"""
        pass

    @abstractmethod
    def save(self) -> bool:
        """ファイルを保存する"""
        pass
    
    @abstractmethod
    def validate_extension(self, path: Path) -> bool:
        """ファイルの拡張子が正しいかチェックする"""
        pass