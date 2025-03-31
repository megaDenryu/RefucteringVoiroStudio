from typing import Literal
from pydantic import BaseModel

class IMessageQuery(BaseModel):
    id: str
    role: Literal['system', 'user', 'assistant']
    content: str

    @staticmethod
    def systemMessage(contetnt:str) -> "IMessageQuery":
        return IMessageQuery(id="system", role="system", content=contetnt)

class IMessageList(BaseModel):
    messages: list[IMessageQuery]