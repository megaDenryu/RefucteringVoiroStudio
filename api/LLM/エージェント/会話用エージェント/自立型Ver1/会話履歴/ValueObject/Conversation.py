
from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1


# 会話履歴。jsonとして保存することも視野に入れている。
class Conversation(BaseModel):
    history: list[MessageUnitVer1]