from typing import Literal
from pydantic import BaseModel

class IMessageQuery(BaseModel):
    id: str
    role: Literal['system', 'user', 'assistant']
    content: str

class IMessageList(BaseModel):
    messages: list[IMessageQuery]