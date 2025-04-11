
from math import e
import stat
from typing import TypedDict
import uuid

from pydantic import BaseModel
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.LLMリクエスト用BaseModel import ThinkNode


class 思考ノードの結果:
    思考結果: str
    def __init__(self,思考結果:BaseModel) -> None:
        self.思考結果 = 思考結果.model_dump()

class 思考ノードの結果辞書:
    def __init__(self, 思考ノードの結果: dict[str, 思考ノードの結果]) -> None:
        self.思考ノードの結果 = 思考ノードの結果
    def model_dump(self) -> dict[str, str]:
        ret_dict = {}
        for key, value in self.思考ノードの結果.items():
            ret_dict[key] = value.思考結果
        return ret_dict
    def add(self, ノード名: str, 思考結果: 思考ノードの結果) -> None:
        self.思考ノードの結果[ノード名] = 思考結果

class 思考ノードPrimitive(TypedDict):
    ノード名: str
    考えるべき内容: str
    思考結果: str

class ThinkingResult(BaseModel):
    自由思考欄: list[str]
    思考整理結果: str

class 思考用クエリ(QueryProxy):
    def __init__(self,考えるべき内容:str, 前のノードでの結果:思考ノードの結果辞書) -> None:
        self._クエリプロキシ = [
            クエリ段落("考えるべき内容", 考えるべき内容),
            クエリ段落("前のノードでの結果", 前のノードでの結果),
        ]
        self.考えるべき内容 = 考えるべき内容
        self.前のノードでの結果 = 前のノードでの結果

    def カスタム出力(self) -> str:
        return f"""
        # 考えるべき内容:
        {self.考えるべき内容}
        # 前のノードでの結果:
        {self.前のノードでの結果}
        """
    
    
        

class 思考ノード:
    id: str
    ノード名: str
    考えるべき内容: str
    前に終わらせるべき思考ノードのノード名: list[str]
    前のノードの結果辞書: 思考ノードの結果辞書
    思考結果: 思考ノードの結果|None = None
    _llmBox: 切り替え可能LLMBox
    def __init__(self,thinkNode:ThinkNode) -> None:
        self.id = str(uuid.uuid4())
        self.ノード名 = thinkNode.ノード名
        self.考えるべき内容 = thinkNode.考えるべき内容
        self.前に終わらせるべき思考ノードのノード名 = thinkNode.前に終わらせるべき思考ノードのノード名
        self.前のノードの結果辞書 = 思考ノードの結果辞書({})
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.思考ノード)
    async def 実行(self)->思考ノードの結果:
        v思考用クエリ = 思考用クエリ(self.考えるべき内容, self.前のノードの結果辞書)
        v思考結果 = await self._llmBox.llmUnit.asyncGenerateResponse(v思考用クエリ.json文字列でクエリ出力, ThinkingResult)
        if not isinstance(v思考結果, ThinkingResult):
            raise TypeError("思考ノードの結果がThinkingResultではありません")
        ExtendFunc.ExtendPrint(v思考結果.model_dump())
        self.思考結果 = 思考ノードの結果(思考結果 = v思考結果.思考整理結果)
        return self.思考結果
    def 完了したか(self) -> bool:
        if self.思考結果 is not None:
            return True
        return False
    
    @staticmethod
    def 初期思考ノードを生成() -> "思考ノード":
        """
        思考ノードリストから初期思考ノードを生成する
        """
        node = 思考ノード(ThinkNode(ノード名="起きたばかりの最初の思考", 考えるべき内容="頭がぼーっとしてたけどもう大丈夫", 前に終わらせるべき思考ノードのノード名=[]))
        node.思考結果 = 思考ノードの結果(思考結果="思い出せない")
        return node
    
    @property
    def primitive(self) -> 思考ノードPrimitive:
        if self.思考結果 is None:
            return {
                "ノード名": self.ノード名,
                "考えるべき内容": self.考えるべき内容,
                "思考結果": "まだ考えていない"
            }
        else:
            return {
                "ノード名": self.ノード名,
                "考えるべき内容": self.考えるべき内容,
                "思考結果": self.思考結果.思考結果
            }
        
    def 他ノードの結果を受け取る(self, ノード名: str, 結果: 思考ノードの結果):
        self.前のノードの結果辞書.add(ノード名, 結果)

