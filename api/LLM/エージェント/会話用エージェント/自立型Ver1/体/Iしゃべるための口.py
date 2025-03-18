
from abc import ABC, abstractmethod


class Iしゃべるための口(ABC):
    @abstractmethod
    def しゃべる(self, message:str):
        pass