from abc import ABC, abstractmethod
import json
from re import S
import uuid

from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery

class クエリ段落:
    def __init__(self, 段落タイトル:str ,内容: IModelDumpAble|str) -> None:
        self.段落タイトル = 段落タイトル
        self.内容 = 内容
    def model_dump(self):
        if isinstance(self.内容, IModelDumpAble):
            return {self.段落タイトル:self.内容.model_dump()}
        else:
            return {self.段落タイトル:self.内容}
        
        

class QueryProxy(ABC):
    _クエリプロキシ: list[クエリ段落] = []
    def __init__(self) -> None:
        pass
    def json文字列で出力(self)->str:
        return json.dumps(self.dict化クエリ, ensure_ascii=False, indent=2)
    
    @property
    def dict化クエリ(self)->list[dict]:
        dict化クエリ = []
        for 段落 in self._クエリプロキシ:
            dict化クエリ.append(段落.model_dump())
        return dict化クエリ
    
    
    
    @property
    def json文字列でクエリ出力(self)->list[IMessageQuery]:
        クエリ:list[IMessageQuery] = [
            IMessageQuery(
                id = str(uuid.uuid4()),
                role = "user",
                content = self.json文字列で出力()
            )
        ]
        return クエリ