
from abc import ABC, abstractmethod


class I自分の情報コンテナ(ABC):
    @property
    @abstractmethod
    def id(self)->str:
        pass
