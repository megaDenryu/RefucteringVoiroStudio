
from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1


# 会話履歴。jsonとして保存することも視野に入れている。
class Conversation:
    history: list[MessageUnitVer1]
    def __init__(self, history: list[MessageUnitVer1]):
        self.history = history