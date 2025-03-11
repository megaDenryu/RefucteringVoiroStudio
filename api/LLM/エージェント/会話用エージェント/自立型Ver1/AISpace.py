

from typing import TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ConversationHistory import ConversationOperator

class AISpaveInitInput(TypedDict):
    id:str

# AIランタイムのエントリーポイント
class AISpace:
    conversationOperator: ConversationOperator 
    def __init__(self, input: AISpaveInitInput):
        self.conversationOperator = ConversationOperator()