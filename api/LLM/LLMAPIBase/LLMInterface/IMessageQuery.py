from typing import Literal
from uuid import uuid4
from pydantic import BaseModel

class IMessageQuery(BaseModel):
    id: str
    role: Literal['system', 'user', 'assistant']
    content: str

    @staticmethod
    def systemMessage(contetnt:str) -> "IMessageQuery":
        return IMessageQuery(id=str(uuid4()), role="system", content=contetnt)

class IMessageList(BaseModel):
    messages: list[IMessageQuery]