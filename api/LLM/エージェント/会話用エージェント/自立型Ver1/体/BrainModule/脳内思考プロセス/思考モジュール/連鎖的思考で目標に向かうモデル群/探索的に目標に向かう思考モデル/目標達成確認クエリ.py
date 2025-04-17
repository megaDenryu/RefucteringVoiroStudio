from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落


class 目標達成確認クエリ(QueryProxy):
    def __init__(self,目標:IModelDumpAble, 思考結果:IModelDumpAble) -> None:
        self._クエリプロキシ = [
            クエリ段落("目標", 目標),
            クエリ段落("思考結果", 思考結果),
            クエリ段落("指示", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
あなたは、キャラクターの思考結果が目標を達成しているかどうかを判断する役割を担っています。
思考結果を評価し、目標達成の可否を明確に示してください。
"""