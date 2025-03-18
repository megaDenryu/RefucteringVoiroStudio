
from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class 外部イベント(BaseModel):
    会話:Conversation
    
