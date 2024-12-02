from typing import Literal
from typing_extensions import TypedDict
from pydantic import BaseModel


class GPTBehaviorDict(TypedDict):
    gptキャラのロール: str
    gptキャラの属性: str
    gptキャラの本能: str
    利益重みベクトル: str
    gptキャラの本能2: str
    根源目標: str

class GPTBehavior(BaseModel):
    gptキャラのロール: str
    gptキャラの属性: str
    gptキャラの本能: str
    利益重みベクトル: str
    gptキャラの本能2: str
    根源目標: str

GPTBehaviorKey = Literal["一般"]|str

