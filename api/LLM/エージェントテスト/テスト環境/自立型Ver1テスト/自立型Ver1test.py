
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpace import AISpace
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.体を持つ者example import 体を持つ者example


class 自立型Ver1test:
    @staticmethod
    def MainLoop():
        aiSpace:AISpace = AISpace({"id":"test"})
        人間1 = 体を持つ者example("結月ゆかり")
        人間2 = 体を持つ者example("初音ミク")
        aiSpace.add人間(人間1)
        aiSpace.add人間(人間2)

        while True:
            message = input("会話を入力してください")
            aiSpace.会話更新(message)

        