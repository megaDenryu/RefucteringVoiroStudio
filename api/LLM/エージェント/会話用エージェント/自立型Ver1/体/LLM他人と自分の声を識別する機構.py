
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント


class LLM他人と自分の声を識別する機構:
    def __init__(self):
        pass

    def 聞く(self, event:外部イベント)->MessageUnit|None:
        """ 
        AISpaceを介して他人の声を受け取る。自分の声も聞こえるがそれは除外するようにする
        その声は脳に渡す
        """
        return self.フィルターする(event.会話)
        
    def フィルターする(self, 会話:Conversation)->MessageUnit|None:
        最新情報:MessageUnit = 会話.history[-1]
        return 最新情報
