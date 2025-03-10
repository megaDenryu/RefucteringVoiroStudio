


# 会話履歴を操作するクラス
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation


class ConversationOperator:
    conversation: Conversation
    def __init__(self):
        self.conversation = Conversation(history=[])
    def addMessage(self, messageUnit):
        self.conversation.history.append(messageUnit)
    def deleteMessage(self, messageId):
        self.conversation.history = [message for message in self.conversation.history if message.id != messageId]
    def saveConversation(self):
        pass

