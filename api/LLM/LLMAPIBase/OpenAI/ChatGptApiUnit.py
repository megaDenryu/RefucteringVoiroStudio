from typing import Type, TypeVar
from openai import AsyncOpenAI, OpenAI
from typing_extensions import Literal
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import ILLMApiUnit, IMessageQuery, ResponseBaseModelT
from api.LLM.LLMAPIBase.LLMType import ChatGPTType, LLMModelType
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict, QueryConverter

class ChatGptApiUnit(ILLMApiUnit):
    """
    責務:APIにリクエストを送り、結果を受け取るだけ。クエリの調整は行わない。
    https://platform.openai.com/docs/models/gpt-4o#gpt-4-5 を参照
    """
    _client: OpenAI
    _async_client: AsyncOpenAI
    model: ChatGPTType
    system_message: MessageQueryDict|None

    def __init__(self,test_mode:bool = True, system_message: MessageQueryDict|None = None, model:ChatGPTType = ChatGPTType.gptp4o_mini):
        try:
            api_key = JsonAccessor.loadOpenAIAPIKey()
            self._client = OpenAI(api_key = api_key)
            self._async_client = AsyncOpenAI(api_key = api_key)
            self.test_mode = test_mode
            self.model = model
            self.system_message = system_message

        except Exception as e:
            print("APIキーの読み込みに失敗しました。")
            raise e
    
    def generateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        messages = QueryConverter.toMessageQueryDictList(message_query)
        if system_message is not None:
            QueryConverter.systemMessageUpdate(messages, QueryConverter.toMessageQueryDict(system_message))
        elif self.system_message is not None:
            QueryConverter.systemMessageUpdate(messages, self.system_message)
        return self.generateResponseStructured(messages, model)
    
    async def asyncGenerateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        messages = QueryConverter.toMessageQueryDictList(message_query)
        if system_message is not None:
            QueryConverter.systemMessageUpdate(messages, QueryConverter.toMessageQueryDict(system_message))
        elif self.system_message is not None:
            QueryConverter.systemMessageUpdate(messages, self.system_message)
        return await self.asyncGenerateResponseStructured(messages, model)
    
    def setModel(self,model_name:LLMModelType):
        if isinstance(model_name, ChatGPTType):
            self.model = model_name

    def setSystemMessage(self, system_message: IMessageQuery):
        self.system_message = QueryConverter.toMessageQueryDict(system_message)

    def generateResponseStructured(self,message_query:list[MessageQueryDict], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        completion = self._client.beta.chat.completions.parse(
                model=self.model.value,
                messages=message_query, # type: ignore
                response_format=model,
        )

        return completion.choices[0].message.parsed
    
    async def asyncGenerateResponseStructured(self,message_query:list[MessageQueryDict], model:Type[ResponseBaseModelT]) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        completion = await self._async_client.beta.chat.completions.parse(
                model=self.model.value,
                messages=message_query, # type: ignore
                response_format=model,
        )

        return completion.choices[0].message.parsed

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

    
    
    

    
        
