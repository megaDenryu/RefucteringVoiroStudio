

from pydantic import BaseModel, Field


class COEIROINKv2SettingModel(BaseModel):
    path: str = Field(
        default="",
        title="COEIROINKv2のパス",
        description="COEIROINKv2のパスを入力してください"
    )