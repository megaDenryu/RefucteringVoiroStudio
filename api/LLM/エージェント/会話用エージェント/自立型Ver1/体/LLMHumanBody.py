from typing import Callable, TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.Iしゃべるための口 import I表現機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMBrain import LLMBrain
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMEar import LLM他人と自分の声を識別する機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント



class LLMHumanBody:
    v他人と自分の声を識別する機構: LLM他人と自分の声を識別する機構
    v脳: LLMBrain

    v会話履歴: I会話履歴
    v口: I表現機構

    def __init__(self, input: LLMHumanBodyInput):
        self.v会話履歴 = input["会話履歴"]
        self.v口 = input["表現機構"]
        self.v他人と自分の声を識別する機構 = LLM他人と自分の声を識別する機構()
        self.v脳 = LLMBrain()
    
    async def イベント反応メインプロセス(self):
        event:外部イベント = self.イベントとして会話を解釈する(self.v会話履歴.会話())
        v表現したいこと = await self.イベントが発生した時の行動(event)
        self.v口.表現する(v表現したいこと)

    async def イベントが発生した時の行動(self, event:外部イベント)->PresentationByBody:
        フィルター済みの結果 = self.v他人と自分の声を識別する機構.聞く(event)
        v思考結果:思考結果 = await self.v脳.考える(フィルター済みの結果)
        v表現したいこと:PresentationByBody = self.思考結果から表現したいことをまとめる(v思考結果)
        return v表現したいこと

    # 下は今後別のオブジェクトの責務になるかもしれない
    def イベントとして会話を解釈する(self, messageUnit)->外部イベント:
        return 外部イベント(会話 = messageUnit)
    
    def 思考結果から表現したいことをまとめる(self, 思考結果:思考結果)->PresentationByBody:
        return PresentationByBody(文章 = 思考結果.結論, 感情=思考結果.感情)
        
