

from typing import TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ConversationHistory import ConversationHistory
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者

class AISpaceInitInput(TypedDict):
    id:str

# AIランタイムのエントリーポイント
class AISpace:
    conversationHistory: ConversationHistory
    人間examples: list[I体を持つ者] = []
    def __init__(self, input: AISpaceInitInput):
        self.conversationHistory = ConversationHistory()

    def add人間(self, 人間:I体を持つ者):
        人間.会話履歴注入(self.conversationHistory)
        self.人間examples.append(人間)