from typing import Callable, TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴発行者
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.Iしゃべるための口 import Iしゃべるための口
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMBrain import LLMBrain
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMEar import LLM他人と自分の声を識別する機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント



class LLMHumanBody:
    v他人と自分の声を識別する機構: LLM他人と自分の声を識別する機構
    v脳: LLMBrain

    v会話履歴発行者: I会話履歴発行者
    v口: Iしゃべるための口
    def __init__(self, input: LLMHumanBodyInput):
        self.v会話履歴発行者 = input["会話履歴発行者"]
        self.v口 = input["v口"]
        self.v他人と自分の声を識別する機構 = LLM他人と自分の声を識別する機構()
        self.v脳 = LLMBrain()
    
    async def 脳のメインプロセス(self):
        # イベント駆動にした方がいいのでは？
        while True:
            event:外部イベント = await self.v会話履歴発行者.会話を見る()
            指向結果 = await self.イベントが発生した時の行動(event)

    async def イベントが発生した時の行動(self, event:外部イベント):
        フィルター済みの結果 = self.v他人と自分の声を識別する機構.聞く(event)
        結果 = self.v脳.考える(フィルター済みの結果)

        
        
