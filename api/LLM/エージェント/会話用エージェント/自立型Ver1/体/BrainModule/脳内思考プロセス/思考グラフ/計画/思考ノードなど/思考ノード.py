
from math import e
import stat
import uuid
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.LLMリクエスト用BaseModel import ThinkNode


class 思考ノードの結果:
    思考結果: str
    def __init__(self,思考結果: str) -> None:
        self.思考結果 = 思考結果

class 思考ノード:
    id: str
    ノード名: str
    考えるべき内容: str
    前に終わらせるべき思考ノードのノード名: list[str]
    思考結果: 思考ノードの結果|None = None
    _llmBox: 切り替え可能LLMBox
    def __init__(self,thinkNode:ThinkNode) -> None:
        self.id = str(uuid.uuid4())
        self.ノード名 = thinkNode.ノード名
        self.考えるべき内容 = thinkNode.考えるべき内容
        self.前に終わらせるべき思考ノードのノード名 = thinkNode.前に終わらせるべき思考ノードのノード名
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.思考ノード)
    async def 実行(self)->思考ノードの結果:
        self.思考結果 = 思考ノードの結果(思考結果="思考ノードの実行結果")
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
        node = 思考ノード(ThinkNode(ノード名="起きたばかりの最初の思考", 考えるべき内容="今日は何をしないといけなかったっけ", 前に終わらせるべき思考ノードのノード名=[]))
        node.思考結果 = 思考ノードの結果(思考結果="思い出せない")
        return node
    
    @property
    async def primitive(self) -> dict:
        if self.思考結果 is None:
            思考結果 = await self.実行()
            return {
                "ノード名": self.ノード名,
                "考えるべき内容": self.考えるべき内容,
                "思考結果": 思考結果
            }
        else:
            return {
                "ノード名": self.ノード名,
                "考えるべき内容": self.考えるべき内容,
                "思考結果": self.思考結果.思考結果
            }