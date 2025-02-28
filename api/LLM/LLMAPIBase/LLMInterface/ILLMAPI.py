from abc import ABC, abstractmethod
import enum
from typing import Literal, Type, TypeVar

from pydantic import BaseModel


ResponseBaseModelT = TypeVar("ResponseBaseModelT", bound=BaseModel)
ResponseEnumT = TypeVar("ResponseEnumT", bound=enum.Enum)

class IMessageQuery(BaseModel):
    id: str
    role: Literal['system', 'user', 'assistant']
    content: str

class IMessageList(BaseModel):
    messages: list[IMessageQuery]

class ILLMResponse(ABC):
    @abstractmethod
    def id(self)->str:
        pass

class ILLMApiUnit(ABC):
    @abstractmethod
    def generateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        pass

    @abstractmethod
    async def asyncGenerateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        pass

    @abstractmethod
    def setModel(self,model_name:str):
        pass