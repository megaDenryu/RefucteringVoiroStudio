# 会話履歴を操作するクラス
from typing import Callable
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class ConversationHistory(I会話履歴):
    conversation: Conversation
    _onMessageAction: list[Callable[[], None]] = []
    def __init__(self):
        self.conversation = Conversation(history=[])
    def addMessage(self, messageUnit):
        self.conversation.history.append(messageUnit)
        for action in self._onMessageAction:
            action()
    def deleteMessage(self, messageId):
        self.conversation.history = [message for message in self.conversation.history if message.id != messageId]
    def saveConversation(self):
        pass
    def addOnMessage(self, method:Callable[[], None]):
        self._onMessageAction.append(method)
    def 会話(self)->Conversation:
        return self.conversation

