
from sqlite3 import Time
from api.Extend.ExtendFunc import TimeExtend
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody


class 失敗イベント(I脳内表現イベント):
    _event:PresentationByBody
    _time:TimeExtend # 失敗したときの時間
    _本人の名前:str
    def __init__(self, event:PresentationByBody, time:TimeExtend, 本人の名前:str):
        self._event = event
        self._time = time
        self._本人の名前 = 本人の名前
    def eventToStr(self) -> str:
        return f"{self._本人の名前}は、{self._event.感情}という感情にあり、「{self._event.文章}」を喋ろうとしたが会話が進んでいたので言えなかった。" 
    
    @property
    def time(self) -> TimeExtend:
        return self._time


