from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴


class 感情ベクトル生成クエリプロキシ(QueryProxy):
    _クエリプロキシ: list[クエリ段落]
    def __init__(self) -> None:
        self._クエリプロキシ = []
    @classmethod
    def 履歴から生成(cls, v状況履歴: 状況履歴, v思考履歴: 思考履歴) -> "感情ベクトル生成クエリプロキシ":
        プロキシ = cls()
        プロキシ._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("思考履歴", v思考履歴),
            クエリ段落("指示", プロキシ.指示文),
        ]
        return プロキシ
    
    @classmethod
    def 状況から生成(cls, 状況:list[IModelDumpAble|str]) -> "感情ベクトル生成クエリプロキシ":
        プロキシ = cls()
        プロキシ._クエリプロキシ = []
        for index in range(len(状況)):
            状況要素 = 状況[index]
            プロキシ._クエリプロキシ.append(クエリ段落(f"状況{index}", 状況要素))
        プロキシ._クエリプロキシ.append(クエリ段落("指示", プロキシ.指示文))
        return プロキシ

    @property
    def 指示文(self) -> str:
        return """
あなたは、状況からキャラクターが脳の中でどのような報酬を得られるか推定して生成してください。
報酬の型の各プロパティは負の値も許容され、それは罰則を意味します。キャラクターは報酬を選るたびにそれを資産として蓄積します。負の報酬は資産を減少させます。
資産と報酬は同じ型で表現されます。
"""