
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント


class LLM他人と自分の声を識別する機構:
    def __init__(self):
        pass

    def 聞く(self, event:外部イベント):
        """ 
        AISpaceを介して他人の声を受け取る。自分の声も聞こえるがそれは除外するようにする
        その声は脳に渡す
        """

        
    def フィルターする(self, 会話:Conversation):
        return 会話.history[-1].message
