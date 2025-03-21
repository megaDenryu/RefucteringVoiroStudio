

from abc import ABC, abstractmethod
from typing import Literal

from api.LLM.エージェント.RubiConverter.KanaText import KanaText


class IRubiConverterUnit(ABC):
    @abstractmethod
    async def convertAsync(self, text:str) -> KanaText|Literal['テストモードです']|None:
        pass
    