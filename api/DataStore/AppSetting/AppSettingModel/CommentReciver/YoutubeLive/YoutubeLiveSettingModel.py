

from pydantic import BaseModel, Field


class YoutubeLiveSettingModel(BaseModel):
    配信URL: str = Field(
        default="test_youtube", 
        title="Youtube配信URL", 
        description="Youtubeの配信URLを入力してください"
        )