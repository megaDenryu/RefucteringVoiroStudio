
from pydantic import BaseModel
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message

# 発言
class MessageUnitVer1:
    id:str
    time:TimeExtend
    message:Message
    speaker:SpeakerInfo
    def __init__(self, id:str, time:TimeExtend, message:Message, speaker:SpeakerInfo):
        self.id = id
        self.time = time
        self.message = message
        self.speaker = speaker

    def 状況内容として報告(self)->str:
        return f"{self.speaker.displayName}は、「{self.message.text}」と言った。"