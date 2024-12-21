

from pydantic import BaseModel, Field

from enum import Enum

class GPTEnable(str,Enum):
    ON = "ON"
    OFF = "OFF"

class GPTSettingModel(BaseModel):
    GPT起動状況: GPTEnable = Field(
        default=GPTEnable.OFF,
        title="GPT起動状況", 
        description="GPT起動状況を入力してください"
    )