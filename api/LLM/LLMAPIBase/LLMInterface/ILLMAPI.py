from abc import ABC, abstractmethod

from pydantic import BaseModel



class MessageQuery(BaseModel):
    id: str

class IMessageList(BaseModel):
    messages: list[MessageQuery]

class ILLMResponse(ABC):
    @abstractmethod
    def 文章を受け取る(self, key: str) -> BaseModel:
        pass

class ILLMAPI(ABC):
    @abstractmethod
    def 文章を送る(self, messages:IMessageList) -> BaseModel:
        pass