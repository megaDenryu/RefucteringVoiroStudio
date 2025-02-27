

from abc import ABC, abstractmethod
from typing import Literal

from api.LLM.RubiConverter.KanaText import KanaText


class IRubiConverterUnit(ABC):
    @abstractmethod
    def convertAsync(self, text:str) -> KanaText|Literal['テストモードです']|None:
        pass
    