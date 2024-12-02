from asyncio import Queue
import asyncio
from api.Epic.Epic import Epic, MassageHistoryUnit, MessageUnit
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.InstanceManager.GptAgentInstanceManager import GPTAgentInstanceManager
from api.gptAI.AgentManager import GPTAgent, Reciever, TransportedItem
from api.gptAI.GPTMode import GptModeManager


class InputReciever():
    epic:Epic
    gpt_agent_dict: GPTAgentInstanceManager
    def __init__(self, epic:Epic, gptAgentInstanceManager:GPTAgentInstanceManager):
        self.name = "入力受付エージェント"
        self.epic = epic
        self.gpt_agent_dict = gptAgentInstanceManager
        self.message_stack:list[MassageHistoryUnit] = []
        self.event_queue = Queue[TransportedItem]()
        self.event_queue_dict:dict[Reciever,Queue[TransportedItem]] = {}
        self.runnnig = False
    async def runObserveEpic(self):
        if self.runnnig == False:
            self.runnnig = True
            await self.observeEpic()
    
    async def stopObserveEpic(self):
        self.runnnig = False
        stop_object = MassageHistoryUnit(
            message = MessageUnit({"エラー":"エージェントを停止しました"}),
            現在の日付時刻 = TimeExtend(),
            stop = True
        )
        await self.epic.OnMessageEvent.put(stop_object)
        stop_ti = TransportedItem.init()
        stop_ti.stop = True
        stop_ti.time = self.epic.getLatestMessage()['現在の日付時刻']
        stop_ti.recieve_messages = self.convertMessageHistoryToTransportedItemData(self.message_stack, 0, len(self.message_stack))
        await self.notify(stop_ti)

    async def observeEpic(self):
        while True:
            if self.runnnig == False:
                return
            # epic.onMessageEventを監視する。メッセージが追加されれば3秒待って、また新しいメッセージが追加されればまた3秒待つ。３秒待ってもメッセージが追加されなければ次のエージェントに送る。
            message = await self.epic.OnMessageEvent.get()
            
            if self.runnnig == False:
                # 上で待っている間にキャンセルされてたら終了
                return

            ExtendFunc.ExtendPrint(message)
            self.appendMessageToStack(message)
            while not self.epic.OnMessageEvent.empty():
                message = await self.epic.OnMessageEvent.get()
                self.appendMessageToStack(message)
            # メッセージが追加されたらメッセージスタックに追加。送信したら解放する。
            await asyncio.sleep(3)
            if not self.epic.OnMessageEvent.empty():
                continue

            agent_stop = False
            for agent in self.gpt_agent_dict.GPTAgents:
                # 全てのエージェントを確認
                last_speskers = self.message_stack[-1]["message"].speakers
                ExtendFunc.ExtendPrint(f"{agent.manager.chara_name}が{last_speskers}にあるか確認します")
                if agent.manager.chara_name in self.message_stack[-1]["message"].speakers:
                    # メッセージスタックの最後のメッセージがこのエージェントが送ったメッセージであれば送信しない
                    ExtendFunc.ExtendPrint(f"{agent.manager.chara_name}が最後に送ったメッセージがあったので次のエージェントには送信しませんでした。")
                    agent_stop = True
            
            if agent_stop:
                continue
                    
            # ここで次のエージェントに送る
            last = len(self.message_stack)
            transported_item:TransportedItem = TransportedItem.init()
            transported_item.time = self.message_stack[-1]['現在の日付時刻']
            transported_item.recieve_messages = self.convertMessageHistoryToTransportedItemData(self.message_stack, 0, last)
            ExtendFunc.ExtendPrint(transported_item)
            await self.notify(transported_item)

    def appendReciever(self, reciever:Reciever):
        self.event_queue_dict[reciever] = Queue[TransportedItem]()
        return self.event_queue_dict[reciever]
            
    async def notify(self, data:TransportedItem):
        # LLMが出力した成功か失敗かを通知
        task = []
        for event_queue in self.event_queue_dict.values():
            task.append(event_queue.put(data))
        await asyncio.gather(*task)
            
    async def handleEventAsync(self, data = None):
        # x秒非同期に待つ
        await asyncio.sleep(3)
        # 次が来てるかどうかをチェック。

    @staticmethod
    def convertMessageHistoryToTransportedItemData(message_history:list[MassageHistoryUnit], start_index:int, end_index:int)->str:
        """
        message_historyをstart_indexからend_indexまでのメッセージを連結して文字列に変換して返す
        """
        ret_string = ""
        for i in range(start_index, end_index):
            ret_string = f"{ret_string}{ExtendFunc.dictToStr(message_history[i]['message'].message)}"
        return ret_string
    
    def appendMessageToStack(self, message:MassageHistoryUnit):
        self.message_stack.append(message)
    
    def judgeClearMessageStack(self)->bool:
        """
        thinkAgentに各セリフがたどり着くまでは送り続ける。thinkAgentにたどり着いたらメッセージスタックを解放する。
        """
        return True
    
    def addMessageStack(self, messages:list[MassageHistoryUnit]):
        self.message_stack += messages
    
    def clearMessageStack(self, time:TimeExtend):
        """
        timeより以前のメッセージは削除する
        """
        num = self.getMessageNumFromTime(time)
        if num is None:
            return
        else:
            if num == len(self.message_stack) - 1:
                self.message_stack = []
            else:
                self.message_stack = self.message_stack[num+1:]

    def getMessageNumFromTime(self, time:TimeExtend):
        length = len(self.message_stack)
        for i in range(length-1, -1, -1):
            if self.message_stack[i]['現在の日付時刻'] < time:
                return i
        return None
    
    def convertInputRecieverMessageHistoryToTransportedItemData(self)->str:
        return Epic.convertMessageHistoryToTransportedItemData(self.message_stack, 0, len(self.message_stack))
    
    