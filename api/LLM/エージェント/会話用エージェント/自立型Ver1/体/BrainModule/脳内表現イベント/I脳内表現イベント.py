
from abc import ABC, abstractmethod

from api.Extend.ExtendFunc import TimeExtend


class I脳内表現イベント(ABC):
    @abstractmethod
    def eventToStr(self)->str:
        pass
    @property
    @abstractmethod
    def time(self)->TimeExtend:
        pass
