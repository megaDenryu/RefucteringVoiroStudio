
from typing import Callable, TypedDict

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴発行者
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.Iしゃべるための口 import Iしゃべるための口


class LLMHumanBodyInput(TypedDict):
    会話履歴発行者: I会話履歴発行者
    v口: Iしゃべるための口