from enum import Enum
from typing import Literal
from pydantic import BaseModel,Field

# 何かの問にたいして結論を出すモデル

class ExpartModel(BaseModel):
    """
    複数の専門家を登場させて、学際的な議論の様子をシミュレートするモデル
    専門家の種類を指定することで、特定の分野に特化した議論を行うことができる
    """
    仮のキャラクター名: str
    国籍または文化圏: str = Field(description="国籍または文化圏")
    専門の大枠:list[str] = Field(description="それを勉強するときに行く学校や学科などの種類。例: 医療、工学、経済学、音楽、ゲーム制作、トリマー、など")
    専門の詳細:list[str] = Field(description="専門の詳細")

class SerifModel(BaseModel):
    発言者: str = Field(description="発言者")
    発現前の脳内思考: str = Field(description="発言前の脳内思考")
    発言内容: str = Field(description="発言内容")


class ConversationProgressStatus(Enum):
    """
    結論が出たかまだ続けるかの判断
    """
    結論が出た = "結論が出た"
    まだ続ける = "まだ続ける"


# 専門家同士の会話の様子をシミュレートするためのクラス
class ExpertConversation(BaseModel):
    """
    専門家同士の会話の様子をシミュレートするためのクラス
    """
    会話種別: Literal["同じ専門家同士の会話", "異なる専門家同士の学際的会話"]
    登場する専門家の選定: str
    登場する専門家: list[ExpartModel]
    どのような形式で何を目的にして話すかの準備的議論: list[SerifModel]
    本番会話内容: list[SerifModel]
    結論が出たかまだ続けるかの判断: ConversationProgressStatus

class ExpertConversationContinue(BaseModel):
    """
    専門家同士の会話の続きの型
    """
    本番会話内容: list[SerifModel]
    結論が出たかまだ続けるかの判断: ConversationProgressStatus = Field(description="結論が出たかまだ続けるかの判断")
