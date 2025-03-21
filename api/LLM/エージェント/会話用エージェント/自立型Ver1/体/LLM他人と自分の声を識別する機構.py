
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント


class LLM他人と自分の声を識別する機構:
    def __init__(self):
        pass

    def 聞く(self, event:外部イベント)->MessageUnitVer1|None:
        """ 
        AISpaceを介して他人の声を受け取る。自分の声も聞こえるがそれは除外するようにする
        その声は脳に渡す
        """
        return self.フィルターする(event.会話)
        
    def フィルターする(self, 会話:Conversation)->MessageUnitVer1|None:
        最新情報:MessageUnitVer1 = 会話.history[-1]
        return 最新情報
