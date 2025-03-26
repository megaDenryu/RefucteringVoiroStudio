
from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class 外部イベント:
    会話:Conversation
    def __init__(self, 会話:Conversation):
        self.会話 = 会話
