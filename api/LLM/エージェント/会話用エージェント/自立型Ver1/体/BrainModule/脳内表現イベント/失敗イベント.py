
from sqlite3 import Time
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody


class 失敗イベント(I脳内表現イベント):
    def __init__(self, event:PresentationByBody, time:TimeExtend):
        self.失敗イベント = False
