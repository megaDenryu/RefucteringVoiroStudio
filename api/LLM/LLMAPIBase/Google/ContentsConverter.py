
from typing import Literal
import uuid
from google.genai import types

from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import IMessageQuery

class ContentsConverter:
    @staticmethod
    def toContent(query:IMessageQuery)->types.Content|None:
        if query.role == "system":
            #Contetntにはシステムメッセージは含まれない仕様になっている。
            return None
        elif query.role == "user":
            return types.Content(
                role="user",
                parts=[types.Part.from_text(text=query.content)]
            )
        elif query.role == "assistant":
            return types.Content(
                role="model",
                parts=[types.Part.from_text(text=query.content)]
            )
        else:
            raise Exception("roleが不正です")
    
    @staticmethod
    def toContentList(query_list:list[IMessageQuery])->types.ContentListUnion:#list[types.Content]:
        content_list:types.ContentListUnion = []
        for query in query_list:
            content = ContentsConverter.toContent(query)
            if content is None:
                continue
            content_list.append(content)
        return content_list
    
    @staticmethod
    def toMessageQuery(gemini_content:types.Content,id:str|None=None)->IMessageQuery|None:
        id = uuid.uuid4().hex if id is None else id
        if gemini_content is None or gemini_content.parts is None or len(gemini_content.parts) == 0 or gemini_content.parts[0].text == None:
            return None

        content = gemini_content.parts[0].text
        if gemini_content.role == "user":
            return IMessageQuery(
                id="",
                role="user",
                content=content
            )
        elif gemini_content.role == "model":
            return IMessageQuery(
                id="",
                role="assistant",
                content=content
            )
        else:
            raise Exception("roleが不正です")

    @staticmethod
    def toMessageQueryDictList(content_list:list[types.Content])->list[IMessageQuery]:
        query_list: list[IMessageQuery] = []
        for content in content_list:
            content = ContentsConverter.toMessageQuery(content)
            if content is None:
                continue
            query_list.append(content)
        return query_list