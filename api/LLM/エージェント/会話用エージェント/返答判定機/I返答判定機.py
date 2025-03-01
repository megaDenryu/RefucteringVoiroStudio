

from abc import ABC, abstractmethod
from typing import Union

from api.LLM.エージェント.会話用エージェント.返答判定機.UserInput import c完全入力, c未完全入力


class I返答判定機(ABC):
    @abstractmethod
    async def f判定(self, a未完全入力: c未完全入力) -> Union[c未完全入力, c完全入力]:
        pass