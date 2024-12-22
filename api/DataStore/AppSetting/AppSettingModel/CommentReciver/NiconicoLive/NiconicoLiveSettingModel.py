

from enum import Enum
from pydantic import BaseModel, Field

class CommentOnOff(str,Enum):
    ON = "ON"
    OFF = "OFF"

class NiconicoLiveSettingModel(BaseModel):
    配信URL: str = Field(
        default="test_niconico", 
        title="ニコ生配信URL", 
        description="ニコ生の配信URLを入力してください"
        )
    コメント受信: CommentOnOff = Field(
        default=CommentOnOff.OFF,
        title="コメント受信", 
        description="コメント受信をONにするかOFFにするか選択してください"
    )
    コメント禁止ワード: list[str] = Field(
        default=["4ね"],
        title="コメント禁止ワード",
        description="コメント禁止ワードを入力してください"
    )