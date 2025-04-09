
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 自分の情報コンテナ(I自分の情報コンテナ):
    _id:str
    @property
    def id(self)->str:
        return self._id
    @property
    def 表示名(self)->str:
        return self._id
    def __init__(self,id:str):
        self._id = id