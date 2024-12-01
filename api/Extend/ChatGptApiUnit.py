from openai import AsyncOpenAI, OpenAI
from typing_extensions import Literal, TypedDict

from api.DataStore.JsonAccessor import JsonAccessor


class ChatGptApiUnit:
    """
    責務:APIにリクエストを送り、結果を受け取るだけ。クエリの調整は行わない。
    """
    class MessageQuery(TypedDict):
        role: Literal['system', 'user', 'assistant']
        content: str

    def __init__(self,test_mode:bool = True):
        try:
            api_key = JsonAccessor.loadOpenAIAPIKey()
            self.client = OpenAI(api_key = api_key)
            self.async_client = AsyncOpenAI(api_key = api_key)
            self.test_mode = test_mode

        except Exception as e:
            print("APIキーの読み込みに失敗しました。")
            raise e
        
    def setTestMode(self, test_mode:bool):
        self.test_mode = test_mode
    async def asyncGenereateResponseGPT4TurboJson(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"

        response = await self.async_client.chat.completions.create (
                model="gpt-4o",
                messages=message_query, # type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    
    def genereateResponseGPT4TurboJson(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self.client.chat.completions.create (
                model="gpt-4o",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT4TurboText(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self.async_client.chat.completions.create(
                model="gpt-4o",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT4TurboText(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT3Turbojson(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self.async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT3Turbojson(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                response_format= { "type":"json_object" },
                temperature=0.7
            )
        return response.choices[0].message.content
    

    async def asyncGenereateResponseGPT3TurboText(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = await self.async_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content
    def genereateResponseGPT3TurboText(self,message_query:list[MessageQuery]):
        if self.test_mode == True:
            print("テストモードです")
            return "テストモードです"
        response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_query,# type: ignore
                temperature=0.7
            )
        return response.choices[0].message.content