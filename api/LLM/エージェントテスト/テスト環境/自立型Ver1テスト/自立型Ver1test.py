
from uuid import uuid4
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpace import AISpace
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.体を持つ者example import 体を持つ者example


class 自立型Ver1test:
    @staticmethod
    async def MainLoop():
        aiSpace:AISpace = AISpace({"id":"test"})
        人間1 = 体を持つ者example("結月ゆかり")
        人間2 = 体を持つ者example("琴葉葵")
        人間3 = 体を持つ者example("弦巻マキ")
        妖精1 = 体を持つ者example("めいかみこと")
        aiSpace.空間に人間を追加して会話履歴を注入(人間1)
        aiSpace.空間に人間を追加して会話履歴を注入(人間2)
        aiSpace.空間に人間を追加して会話履歴を注入(人間3)
        aiSpace.空間に人間を追加して会話履歴を注入(妖精1)

        while True:
            message = input("会話を入力してください")
            messageUnit = MessageUnitVer1(id=str(uuid4()), time=TimeExtend.nowDateTime(), message=Message(text=message), speaker=SpeakerInfo(speakerId="弦巻マキ", displayName="弦巻マキ"))
            aiSpace.会話更新(messageUnit)

        