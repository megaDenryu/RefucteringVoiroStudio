

from pydantic import BaseModel, Field


class COEIROINKv2SettingModel(BaseModel):
    path: str = Field(
        default="",
        title="COEIROINKv2.exeのパス",
        description="COEIROINKv2.exeのパスを入力してください"
    )