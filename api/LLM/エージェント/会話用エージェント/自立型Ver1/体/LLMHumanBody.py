from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMBrain import LLMBrain
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMEar import LLMEar


class LLMHumanBody:
    耳: LLMEar
    脳: LLMBrain
    def __init__(self):
        self.耳 = LLMEar()
        self.脳 = LLMBrain()
        pass