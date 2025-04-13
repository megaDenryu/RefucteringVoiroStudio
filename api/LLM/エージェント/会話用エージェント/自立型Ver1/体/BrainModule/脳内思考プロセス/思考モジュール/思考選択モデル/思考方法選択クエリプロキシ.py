from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴


class 思考方法選択クエリプロキシ(QueryProxy):
    def __init__(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴) -> None:
        self._クエリプロキシ = [
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("思考履歴", v思考履歴),
            クエリ段落("指示", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
あなたは、キャラクターの思考方法を選択する役割を担っています。
キャラクターが直面している状況や思考履歴を考慮し、適切な思考方法を選択してください。
"""