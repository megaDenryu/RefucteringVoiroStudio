
from pydantic import BaseModel, Field


class VoiceVoxSettingModel(BaseModel):
    path: str = Field(
        default="",
        title="VOICEVOX.exeのパス",
        description="VOICEVOX.exeのパスを入力してください"
    )