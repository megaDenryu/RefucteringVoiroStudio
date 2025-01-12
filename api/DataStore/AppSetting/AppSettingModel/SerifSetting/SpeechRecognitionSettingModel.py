

from pydantic import BaseModel, Field


class SerifSettingModel(BaseModel):
    AI補正: bool = Field(default=True, title="AI補正", description="AI補正を有効にするか選択してください")
    発言間隔の秒数: int = Field(default=4, title="発言間隔", description="発言間隔の秒数を入力してください")
    