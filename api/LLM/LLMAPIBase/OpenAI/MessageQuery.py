from typing import TypedDict
from typing_extensions import Literal
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import IMessageQuery

class MessageQueryDict(TypedDict):
    role: Literal['system', 'user', 'assistant']
    content: str


class QueryConverter:
    @staticmethod
    def toMessageQueryDict(query:IMessageQuery) -> MessageQueryDict:
        return {
            "role": IMessageQuery.role,
            "content": IMessageQuery.content
        }
    
    @staticmethod
    def toMessageQuery(query:MessageQueryDict, id:str) -> IMessageQuery:
        return IMessageQuery(
            id=id,
            role=query["role"],
            content=query["content"]
        )
    
    @staticmethod
    def toMessageQueryDictList(query_list:list[IMessageQuery]) -> list[MessageQueryDict]:
        return [QueryConverter.toMessageQueryDict(query) for query in query_list]
    
    @staticmethod
    def systemMessageUpdate(messages:list[MessageQueryDict], system_message:MessageQueryDict) -> list[MessageQueryDict]:
        if system_message["role"] != "system":
            raise Exception("system_messageのroleがsystemではありません。")
        first_message = messages[0]
        if first_message["role"] == "system":
            messages[0] = system_message
        else:
            messages.insert(0, system_message)

        return messages