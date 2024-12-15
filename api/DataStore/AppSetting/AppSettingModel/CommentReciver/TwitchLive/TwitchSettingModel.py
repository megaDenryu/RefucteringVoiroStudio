

from pydantic import BaseModel, Field


class TwitchSettingModel(BaseModel):
    配信URL: str = Field(
        default="test_twitch", 
        title="Twitch配信URL", 
        description="Twitch配信URLを入力してください"
        )