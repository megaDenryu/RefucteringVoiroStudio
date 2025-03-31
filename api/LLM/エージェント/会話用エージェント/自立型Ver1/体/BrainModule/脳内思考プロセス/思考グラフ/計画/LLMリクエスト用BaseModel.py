from pydantic import BaseModel


class ThinkNode(BaseModel):
    ノード名: str
    考えるべき内容: str
    前に終わらせるべき思考ノードのノード名: list[str]
    
class ThinkGraph(BaseModel):
    自由思考欄: str
    思考グラフ: list[ThinkNode]