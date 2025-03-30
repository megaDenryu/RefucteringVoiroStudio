from abc import ABC, abstractmethod
import json
import uuid

from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery


class QueryProxy(ABC):
    _クエリプロキシ: list = []
    def __init__(self) -> None:
        pass
    def json文字列で出力(self)->str:
        return json.dumps(self._クエリプロキシ, ensure_ascii=False, indent=2)
    
    @abstractmethod
    def カスタム出力(self)->str:
        pass
    
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