from mailbox import Message
from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.SpeakerInfo import SpeakerInfo

# 発言
class MessageUnit(BaseModel):
    id:str
    time:str
    message:Message
    speaker:SpeakerInfo