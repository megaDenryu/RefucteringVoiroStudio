
from typing import Callable, TypedDict

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.Iしゃべるための口 import I表現機構


class LLMHumanBodyInput(TypedDict):
    会話履歴: I会話履歴
    表現機構: I表現機構