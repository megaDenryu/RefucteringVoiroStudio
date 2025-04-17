# 目標が達成されているかどうかを判定するためのクラス
from pydantic import BaseModel


class GoalCheckResult(BaseModel):
    目標: str
    結果内容: str
    判定考察: str
    判定結果: bool