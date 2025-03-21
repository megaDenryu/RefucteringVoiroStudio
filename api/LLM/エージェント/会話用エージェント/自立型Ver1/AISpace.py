

from typing import TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpaceInterface import AISpaceInterface
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ConversationHistory import ConversationHistory
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者

class AISpaceInitInput(TypedDict):
    id:str

# AIランタイムのエントリーポイント
class AISpace(AISpaceInterface):
    _conversationHistory: ConversationHistory
    _人間examples: list[I体を持つ者] = []
    def __init__(self, input: AISpaceInitInput):
        self._conversationHistory = ConversationHistory()

    def 空間に人間を追加して会話履歴を注入(self, 人間:I体を持つ者):
        人間.会話履歴注入(self._conversationHistory)
        self._人間examples.append(人間)

    async def 会話更新(self, messageUnit: MessageUnit):
        await self._conversationHistory.新規メッセージ追加してアクションを実行(messageUnit)