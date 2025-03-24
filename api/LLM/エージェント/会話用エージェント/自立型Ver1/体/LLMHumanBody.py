import enum
from pydantic import BaseModel
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.失敗イベント import 失敗イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.I表現機構 import I表現機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMBrain import LLMBrain
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLM他人と自分の声を識別する機構 import LLM他人と自分の声を識別する機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.体内信号機.体内信号機 import 体内信号機
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.思考結果から表現したいことへ加工するLLM import 思考結果から表現したいことへ加工するLLM
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント

class 結果種類(enum.Enum):
    自分の声だった = "自分の声だった"
    表現した = "表現した"
    何もしなかった = "何もしなかった"

class イベント反応結果(BaseModel):
    結果:結果種類

class LLMHumanBody:
    _v自分の情報:I自分の情報コンテナ
    _v他人と自分の声を識別する機構: LLM他人と自分の声を識別する機構
    _v脳: LLMBrain
    _v会話履歴: I会話履歴
    _v口: I表現機構
    _v体内信号機: 体内信号機
    _思考結果から表現したいことへ加工するLLM = 思考結果から表現したいことへ加工するLLM()
    

    def __init__(self, input: LLMHumanBodyInput):
        self._v自分の情報 = input["自分の情報"]
        self._v会話履歴 = input["会話履歴"]
        self._v口 = input["表現機構"]
        self._v体内信号機 = 体内信号機()
        self._v他人と自分の声を識別する機構 = LLM他人と自分の声を識別する機構(self._v自分の情報, self._v体内信号機)
        self._v脳 = LLMBrain(self._v自分の情報, self._v会話履歴, self._v体内信号機)

        
    
    async def イベント反応メインプロセス(self):
        event発生打刻時間:TimeExtend = self._v体内信号機.新しい反応イベント()
        event:外部イベント = self._イベントとして会話を解釈する(self._v会話履歴.会話())
        反応結果 = await self._イベントが発生した時の行動(event, event発生打刻時間)

    async def _イベントが発生した時の行動(self, event:外部イベント, event発生打刻時間:TimeExtend)->イベント反応結果:
        フィルター済みの結果 = self._v他人と自分の声を識別する機構.聞く(event)
        if フィルター済みの結果 is None:
            return イベント反応結果(結果=結果種類.何もしなかった)
        v思考結果:思考結果 = await self._v脳.イベント反応思考(フィルター済みの結果)
        v表現したいこと:PresentationByBody = await self._思考結果から表現したいことへ加工するLLM.加工する(v思考結果)
        if v表現したいこと is not None:
            if self._v体内信号機.最新イベント打刻時間と同じかどうか(event発生打刻時間) == True:
                self._v口.表現する(v表現したいこと)
                return イベント反応結果(結果=結果種類.表現した)
            else:
                self._v脳.脳内で表現する(失敗イベント(event = v表現したいこと, time = TimeExtend("now"), 本人の名前 = self._v自分の情報.表示名))
                return イベント反応結果(結果=結果種類.何もしなかった)
            
        else:
            return イベント反応結果(結果=結果種類.何もしなかった)
        
    
        
    # 下は今後別のオブジェクトの責務になるかもしれない
    def _イベントとして会話を解釈する(self, messageUnit:Conversation)->外部イベント:
        return 外部イベント(会話 = messageUnit)
    
        
