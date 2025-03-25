
"""
このクラスの依存関係の想定
体内信号機 -> LLMHumanBody : ここでコンストラクトされて下の部分に注入される
体内信号機 -> LLM他人と自分の声を識別する機構
体内信号機 -> LLMBrain
"""
import re
from api.Extend.ExtendFunc import TimeExtend


class 体内信号機:
    _最新イベント打刻時間: TimeExtend
    def __init__(self):
        self._発生している反応イベントの数 = 0

    def 新しい反応イベント(self)->TimeExtend:
        time = TimeExtend("now")
        self._最新イベント打刻時間 = time
        return time
    
    def 最新イベント打刻時間と同じかどうか(self, time:TimeExtend)->bool:
        return self._最新イベント打刻時間 == time
    