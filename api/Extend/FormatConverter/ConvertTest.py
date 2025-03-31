
from pathlib import Path
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.Extend.FileManager.Domain.ファイル作成用オブジェクト.Files.TextFile import TextFile
from api.Extend.FileManager.FileCreater.FileCreater import FileCreater
from api.Extend.FormatConverter import BaseModel2MD
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo


class ConvertTest:
    @staticmethod
    def main():
        # q = MessageUnitVer1(id="1", time=TimeExtend(), message=Message(text="Hello"), speaker=SpeakerInfo(speakerId="1", displayName="Alice"))
        # q_s = [q,q,q,q]
        # # ConvertAndSaveLog.MarkdownConvert(q)
        # ConvertAndSaveLog.MarkdownConvertList(q_s)
        pass