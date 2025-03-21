# 会話履歴を操作するクラス
import asyncio
from api.Extend.CallBackType import AsyncCallback
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnit


class ConversationHistory(I会話履歴):
    conversation: Conversation
    _onMessageAsyncAction: list[AsyncCallback] = []
    def __init__(self):
        self.conversation = Conversation(history=[])
    async def addMessage(self, messageUnit: MessageUnit):
        self.conversation.history.append(messageUnit)
        if self._onMessageAsyncAction:  # アクションがある場合のみ実行
            # すべてのアクションを同時に開始し、全て完了するまで待機
            await asyncio.gather(*[action() for action in self._onMessageAsyncAction])
    def deleteMessage(self, messageId:str):
        self.conversation.history = [message for message in self.conversation.history if message.id != messageId]
    def saveConversation(self):
        pass
    def addOnMessage(self, asyncMethod:AsyncCallback)->None:
        self._onMessageAsyncAction.append(asyncMethod)
    def 会話(self)->Conversation:
        return self.conversation

