from abc import ABC

from api.Extend.ExtendFunc import TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント


class プロセス材料を包んだもの:
    _v脳内表現イベント:I脳内表現イベント
    def __init__(self, v脳内表現イベント:I脳内表現イベント):
        self._v脳内表現イベント = v脳内表現イベント
    
    def 状況内容として報告(self)->str:
        return self._v脳内表現イベント.eventToStr()
    
    @property
    def time(self)->TimeExtend:
        return self._v脳内表現イベント.time