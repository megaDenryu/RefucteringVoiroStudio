
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpace import AISpace
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.Message import Message
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnitParts.SpeakerInfo import SpeakerInfo
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.体を持つ者example import 体を持つ者example


class 自立型Ver1test:
    @staticmethod
    def MainLoop():
        aiSpace:AISpace = AISpace({"id":"test"})
        人間1 = 体を持つ者example("結月ゆかり")
        人間2 = 体を持つ者example("初音ミク")
        aiSpace.空間に人間を追加して会話履歴を注入(人間1)
        aiSpace.空間に人間を追加して会話履歴を注入(人間2)

        while True:
            message = input("会話を入力してください")
            messageUnit = MessageUnit(id="1", time="1", message=Message(text=message), speaker=SpeakerInfo(speakerId="1"))
            aiSpace.会話更新(messageUnit)

        