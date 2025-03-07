
from abc import ABC, abstractmethod


class IFileName(ABC):
    #拡張子をチェックする関数
    @abstractmethod
    def check_extension(self, file_name: str) -> bool:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass