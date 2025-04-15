from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署 import 記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 思考方法選択クエリプロキシ(QueryProxy):
    def __init__(self, v状況履歴: 状況履歴, v思考履歴: 記憶部署, vキャラクター情報:I自分の情報コンテナ) -> None:
        self._クエリプロキシ = [
            クエリ段落("キャラクター情報", vキャラクター情報),
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