
import enum
from typing import Optional, TypeVar
from google import genai
from google.genai.types import GenerateContentResponse
from google.genai.types import ContentUnion
from google.genai.types import ContentUnionDict
from google.genai.types import ContentListUnion
from google.genai.types import ContentListUnionDict
from google.genai.types import GenerateContentConfig
from google.genai.types import GenerateContentConfigOrDict
import google.generativeai as generativeai
from pydantic import BaseModel
from api.DataStore.JsonAccessor import JsonAccessor


ResponseBaseModelT = TypeVar("ResponseFormatT", bound=BaseModel)
ResponseEnumT = TypeVar("ResponseEnumT", bound=enum.Enum)

# https://googleapis.github.io/python-genai/#json-response-schema
class GeminiAPIUnit:
    def __init__(self):
        self.api_key = JsonAccessor.loadGeminiAPIKey()
        self.client = genai.Client(api_key = self.api_key)
        self.モデル名 = "gemini-2.0-flash"

    def modelList(self):
        models = []
        for model in generativeai.list_models():
            models.append(model)
        return models
    
    
    def test(self):
        response = self.client.models.generate_content(model="gemini-2.0-flash", contents="私はメガデンリュウです。わかりますか？")   
        print(response.text)

    #todo システムメッセージ・ユーザーメッセージ・AIメッセージの会話の歴史はどう扱われてるのか理解する
    
    def generateBasic(self, コンテンツ:ContentListUnion | ContentListUnionDict, システムメッセージ:Optional[ContentUnion] = None)->str:
        response = self.client.models.generate_content(
            model=self.モデル名, 
            config=GenerateContentConfig(
                system_instruction=システムメッセージ
            ),
            contents=コンテンツ
        )
    
    # https://ai.google.dev/gemini-api/docs/structured-output?hl=ja&lang=python でBaseModelやEnumを使う方法が定義されている。
    def generateB(self, コンテンツ:str, ベースモデルタイプ:type[ResponseBaseModelT],システムメッセージ:Optional[ContentUnion] = None)->ResponseBaseModelT:
        response:GenerateContentResponse = self.client.models.generate_content(
            model=self.モデル名, 
            contents=コンテンツ, 
            config=GenerateContentConfig(
                response_mime_type="application/json", 
                response_schema=ベースモデルタイプ,
                system_instruction=システムメッセージ
            )
        )
        return response.parsed

    def generateEnum(self, contents:str, enumType:type[ResponseEnumT], システムメッセージ:Optional[ContentUnion] = None)->ResponseEnumT:
        response:GenerateContentResponse = self.client.models.generate_content(
            model=self.モデル名, 
            contents=contents, 
            config=GenerateContentConfig(
                response_mime_type="text/x.enum", 
                response_schema=enum,
                system_instruction=システムメッセージ
            )
        )
        return response.text