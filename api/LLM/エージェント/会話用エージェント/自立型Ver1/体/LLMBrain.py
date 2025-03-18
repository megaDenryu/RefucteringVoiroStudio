
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果


class LLMBrain:
    def __init__(self):
        pass

    async def 考える(self, message) -> 思考結果:
        """ 
        会話をする
        """
        return 思考結果(結論 = "考えた結果", 感情="感情" , 理由="理由")
