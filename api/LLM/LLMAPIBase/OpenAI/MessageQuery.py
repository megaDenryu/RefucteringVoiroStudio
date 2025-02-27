from typing import TypedDict
from typing_extensions import Literal


class MessageQuery(TypedDict):
    role: Literal['system', 'user', 'assistant']
    content: str