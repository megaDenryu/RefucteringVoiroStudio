
from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message

# 発言
class MessageUnitVer1(BaseModel):
    id:str
    time:str
    message:Message
    speaker:SpeakerInfo