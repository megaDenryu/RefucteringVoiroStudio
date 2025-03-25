
from enum import Enum


class LLM用途タイプ(Enum):
    思考結果から表現したいことへ加工するLLM = "思考結果から表現したいことへ加工するLLM"
    プロセス計画 = "プロセス計画"
    方針策定 = "方針策定"