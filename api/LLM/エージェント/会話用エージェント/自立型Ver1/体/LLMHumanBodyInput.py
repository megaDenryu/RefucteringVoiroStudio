
from typing import TypedDict
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.I表現機構 import I表現機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ
class LLMHumanBodyInput(TypedDict):
    自分の情報:I自分の情報コンテナ
    会話履歴: I会話履歴
    表現機構: I表現機構