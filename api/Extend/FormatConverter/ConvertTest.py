
from api.Extend.FormatConverter import BaseModel2MD
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo


class ConvertTest:
    @staticmethod
    def main():
        q = MessageUnitVer1(id="1", time="2021-01-01", message=Message(text="Hello"), speaker=SpeakerInfo(speakerId="1", displayName="Alice"))
        c = BaseModel2MD.MarkdownConverter()
        print(c.convert(q))
