from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 深層的自問自答クエリプロキシ(QueryProxy):
    """
    深層的自問自答クエリプロキシ
    """
    def __init__(self, v状況履歴: 状況履歴, vキャラクター情報:I自分の情報コンテナ, v記憶部署: I記憶部署) -> None:
        self._クエリプロキシ = [
            クエリ段落("キャラクター情報", vキャラクター情報),
            クエリ段落("思考履歴", v記憶部署),
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("指示", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
キャラクターが抱えるであろう内面の葛藤や自問自答的な思考の連鎖を生成してください。
特に、【可能性・選択】と【自己・他者・規範】、【価値・優先順位】のカテゴリで思考が深まるでしょう。
思考は連鎖させ、応答がさらなる問いになることも表現してください。
"""
