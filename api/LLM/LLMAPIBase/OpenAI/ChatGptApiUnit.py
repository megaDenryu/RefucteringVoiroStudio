from typing import Type, TypeVar
from openai import AsyncOpenAI, OpenAI
from pydantic import BaseModel
from typing_extensions import Literal, TypedDict

from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import ILLMApiUnit, IMessageQuery, ResponseBaseModelT
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict, QueryConverter


class ChatGptApiUnit(ILLMApiUnit):
    """
    責務:APIにリクエストを送り、結果を受け取るだけ。クエリの調整は行わない。
    https://platform.openai.com/docs/models/gpt-4o#gpt-4-5 を参照
    """
    _client: OpenAI
    _async_client: AsyncOpenAI
    model: str

    def __init__(self,test_mode:bool = True, model:str = "gpt-4o-mini"):
        try:
            api_key = JsonAccessor.loadOpenAIAPIKey()
            self._client = OpenAI(api_key = api_key)
            self._async_client = AsyncOpenAI(api_key = api_key)
            self.test_mode = test_mode
            self.model = model

        except Exception as e:
            print("APIキーの読み込みに失敗しました。")
            raise e
        
    def setTestMode(self, test_mode:bool):
        self.test_mode = test_mode
    async def asyncGenereateResponseGPT4TurboJson(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"

        response = await self._async_client.chat.completions.create (
                model="gpt-4o",
                messages=message_query, # type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    
    def genereateResponseGPT4TurboJson(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self._client.chat.completions.create (
                model="gpt-4o",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT4TurboText(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self._async_client.chat.completions.create(
                model="gpt-4o",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT4TurboText(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self._client.chat.completions.create(
                model="gpt-4o",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT3Turbojson(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self._async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT3Turbojson(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self._client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT3TurboText(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self._async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT3TurboText(self,message_query:list[MessageQueryDict]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self._client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content

    
    def generateResponseStructured(self,message_query:list[MessageQueryDict], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        completion = self._client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=message_query, # type: ignore
                response_format=model,
        )

        return completion.choices[0].message.parsed
    
    async def asyncGenerateResponseStructured(self,message_query:list[MessageQueryDict], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        completion = await self._async_client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=message_query, # type: ignore
                response_format=model,
        )

        return completion.choices[0].message.parsed
    

    def generateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        messages = QueryConverter.toMessageQueryDictList(message_query)
        return self.generateResponseStructured(messages, model)
    
    async def asyncGenerateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        messages = QueryConverter.toMessageQueryDictList(message_query)
        return await self.asyncGenerateResponseStructured(messages, model)
    
    def setModel(self,model_name:str):
        self.model = model_name
        
