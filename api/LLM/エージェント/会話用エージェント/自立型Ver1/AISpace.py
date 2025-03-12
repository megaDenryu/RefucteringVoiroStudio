

from typing import TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ConversationHistory import ConversationHistory

class AISpaveInitInput(TypedDict):
    id:str

# AIランタイムのエントリーポイント
class AISpace:
    conversationHistory: ConversationHistory 
    def __init__(self, input: AISpaveInitInput):
        self.conversationHistory = ConversationHistory()