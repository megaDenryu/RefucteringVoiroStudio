
from enum import Enum


class LLM用途タイプ(Enum):
    思考結果から表現したいことへ加工するLLM = "思考結果から表現したいことへ加工するLLM"
    方針策定 = "方針策定"
    思考アクション計画する人 = "思考アクション計画する人"

class LLMs用途タイプ(Enum):
    """
    一つの用途で複数のLLMを使う場合に使用する
    """
    思考ノード = "思考ノード"