

from pydantic import BaseModel, Field


class NiconicoLiveSettingModel(BaseModel):
    配信URL: str = Field(
        default="test_niconico", 
        title="ニコ生配信URL", 
        description="ニコ生の配信URLを入力してください"
        )
