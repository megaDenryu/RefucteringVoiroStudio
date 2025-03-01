
import enum
from typing import Literal, Optional, Type, TypeVar, Union
from google import genai
from google.genai import types
from google.genai.types import GenerateContentResponse
from google.genai.types import ContentUnion
from google.genai.types import ContentUnionDict
from google.genai.types import ContentListUnion
from google.genai.types import ContentListUnionDict
from google.genai.types import GenerateContentConfig
from google.genai.types import GenerateContentConfigOrDict
from google.generativeai.models import list_models
from pydantic import BaseModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.Google.ContentsConverter import ContentsConverter
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import ILLMApiUnit, IMessageQuery, ResponseBaseModelT
from api.LLM.LLMAPIBase.LLMInterface.ResponseModel import ResponseEnumT




# https://googleapis.github.io/python-genai/#json-response-schema
# Default value is not supported in the response schema for the Gemini API.
class GeminiAPIUnit(ILLMApiUnit):
    api_key:str|None
    client:genai.Client
    モデル名:str
    test_mode:bool
    system_message:Optional[ContentUnion]

    def __init__(self,test_mode:bool = True, system_message:Optional[ContentUnion] = None):
        self.api_key = JsonAccessor.loadGeminiAPIKey()
        self.client = genai.Client(api_key = self.api_key)
        self.モデル名 = "gemini-2.0-flash"
        self.test_mode = test_mode
        self.system_message = system_message

    def modelList(self):
        models = []
        for model in list_models():
            models.append(model)
        return models
    
    
    def test(self):
        response = self.client.models.generate_content(model="gemini-2.0-flash", contents="私はメガデンリュウです。わかりますか？")   
        print(response.text)

    #todo システムメッセージ・ユーザーメッセージ・AIメッセージの会話の歴史はどう扱われてるのか理解する
    
    def generateBasic(self, コンテンツ:ContentListUnion | ContentListUnionDict, システムメッセージ:Optional[ContentUnion] = None)->str|Literal['テストモードです']|None:
        if self.test_mode == True:
            return "テストモードです"
        response = self.client.models.generate_content(
            model=self.モデル名, 
            config=GenerateContentConfig(
                system_instruction=システムメッセージ
            ),
            contents=コンテンツ
        )
        return response.text
    
    # https://ai.google.dev/gemini-api/docs/structured-output?hl=ja&lang=python でBaseModelやEnumを使う方法が定義されている。
    def generateB(self, コンテンツ:Union[types.ContentListUnion, types.ContentListUnionDict], ベースモデルタイプ:type[ResponseBaseModelT],システムメッセージ:Optional[ContentUnion] = None)->ResponseBaseModelT|Literal['テストモードです']|None:
        if self.test_mode == True:
            return "テストモードです"
        try:
            response:GenerateContentResponse = self.client.models.generate_content(
                model=self.モデル名, 
                contents=コンテンツ, 
                config=GenerateContentConfig(
                    response_mime_type="application/json", 
                    response_schema=ベースモデルタイプ,
                    system_instruction=システムメッセージ
                )
            )
            return response.parsed # type: ignore
        except Exception as e:
            print(e)
            return None
        
    async def asyncGenerateB(self, コンテンツ:Union[types.ContentListUnion, types.ContentListUnionDict], ベースモデルタイプ:type[ResponseBaseModelT],システムメッセージ:Optional[ContentUnion] = None)->ResponseBaseModelT|Literal['テストモードです']|None:
        if self.test_mode == True:
            ExtendFunc.ExtendPrint(["テストモードです"])
            return "テストモードです"
        try:
            response:GenerateContentResponse = await self.client.aio.models.generate_content(
                model=self.モデル名, 
                contents=コンテンツ, 
                config=GenerateContentConfig(
                    response_mime_type="application/json", 
                    response_schema=ベースモデルタイプ,
                    system_instruction=システムメッセージ
                )
            )
            return response.parsed # type: ignore
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            return None

    def generateEnum(self, contents:Union[types.ContentListUnion, types.ContentListUnionDict], enumType:type[ResponseEnumT], システムメッセージ:Optional[ContentUnion] = None)->ResponseEnumT|Literal['テストモードです']|None:
        if self.test_mode == True:
            return "テストモードです"
        try:
            response:GenerateContentResponse = self.client.models.generate_content(
                model=self.モデル名, 
                contents=contents, 
                config=GenerateContentConfig(
                    response_mime_type="text/x.enum", 
                    response_schema=enum,
                    system_instruction=システムメッセージ
                )
            )
            return enumType(response.text)
        except Exception as e:
            print(e)
            return None
        
    def generateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        コンテンツ = ContentsConverter.toContentList(message_query)
        if system_message is not None:
            システムメッセージ = system_message.content  
        elif self.system_message is not None:
            システムメッセージ = self.system_message
        else:
            システムメッセージ = None
        return self.generateB(コンテンツ, model, システムメッセージ)

    async def asyncGenerateResponse(self,message_query:list[IMessageQuery], model:Type[ResponseBaseModelT], system_message:IMessageQuery|None = None) -> ResponseBaseModelT|Literal["テストモードです"]|None:
        コンテンツ = ContentsConverter.toContentList(message_query)
        if system_message is not None:
            システムメッセージ = system_message.content  
        elif self.system_message is not None:
            システムメッセージ = self.system_message
        else:
            raise Exception("システムメッセージが設定されていません")
        return await self.asyncGenerateB(コンテンツ, model, システムメッセージ)

    def setModel(self,model_name:str):
        self.モデル名 = model_name

    def setSystemMessage(self, system_message: IMessageQuery):
        self.system_message = system_message.content