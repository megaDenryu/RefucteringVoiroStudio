from enum import Enum
from typing_extensions import TypedDict

from pydantic import BaseModel
from api.gptAI.HumanInfoValueObject import CharacterName, ICharacterName

#キャラ関係の設定
class CharacterRelationships(BaseModel):
    他のキャラクター名: str
    関係: str

# 感情のEnumクラス
class Emotion(str, Enum):
    怒り = "怒り"
    喜び = "喜び"
    悲しみ = "悲しみ"
    不安 = "不安"
    恐怖 = "恐怖"
    驚き = "驚き"

#行動パターンのクラス
class ActionPattern(BaseModel):
    感情: Emotion
    行動: str


class CharacterAISetting(BaseModel):
    名前: str
    年齢: int
    性別: str
    背景情報: str
    役割: str
    動機: str
    アリバイ: str
    性格特性: str
    関係: list[CharacterRelationships]
    秘密: str
    知っている情報: str
    外見の特徴: str
    所持品: list[str]
    行動パターン: list[ActionPattern]

class CharacterAISettingCollectionUnit(BaseModel):
    key: CharacterName
    value: CharacterAISetting

class CharacterAISettingList(BaseModel):
    list: list[CharacterAISettingCollectionUnit]




