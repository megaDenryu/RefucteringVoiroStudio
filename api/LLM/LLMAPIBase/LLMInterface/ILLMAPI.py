from abc import ABC, abstractmethod
import enum
from typing import Literal, Type, TypeVar
from pydantic import BaseModel
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLMInterface.ResponseModel import ResponseBaseModelT

class ILLMApiUnit(ABC):
    """
    - ChatGptApiUnitの場合はmessage_queryの最初にメッセージクエリを混ぜるのが普通だが、system_messageの引数に与えても適切に処理される。
    - GeminiApiUnitの場合はmessage_queryの毎回のリクエストに対して、system_messageの引数に与えるか、初期化の時に与えるかのどちらか。
    - とりあえずsetSystemMessage関数を使って初期化時にシステムメッセージを設定すれば、後から
    """
    @abstractmethod
    def generateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        pass

    @abstractmethod
    async def asyncGenerateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        pass

    @abstractmethod
    def setModel(self,model_name:str):
        pass

    @abstractmethod
    def setSystemMessage(self, system_message:IMessageQuery):
        # デフォルトで使うシステムメッセージを設定する。generateResponseやasyncGenerateResponse関数の引数にシステムメッセージが与えられた場合は、そのメッセージを使う。
        pass