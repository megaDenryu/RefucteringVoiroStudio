from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.出力BaseModel import ExpertConversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 専門家同士の会話クエリプロキシ(QueryProxy):
    def __init__(self, 私の名前:str ,問い: IModelDumpAble) -> None:
        self._クエリプロキシ = [
            クエリ段落("主人公名", 私の名前),
            クエリ段落("問い", 問い),
            クエリ段落("指示文", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
上は主人公の心の中の問いです。これに対して、何らかの答えやさらなる問を得たいです。そこで解決のために、この悩みを主人公が専門家達と一緒に考えるという設定で、会話をシミュレートしてください。
専門家を選定してもらいますが、独創的な結論を出すために突拍子もない専門家を選定したり、堅実な結論を出すために堅実な専門家を選定したりするかはあなたの自由です。
"""

class 専門家同士の会話クエリプロキシ2(QueryProxy):
    def __init__(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報:I自分の情報コンテナ) -> None:
        self._クエリプロキシ = [
            クエリ段落("キャラクター情報", vキャラクター情報.自分の情報),
            クエリ段落("思考履歴", v思考履歴),
            クエリ段落("状況履歴", v状況履歴),
            クエリ段落("指示文", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
与えられた入力の中の「何かしらの問い」に対して、何らかの答えやさらなる問を得たいです。そこで解決のために専門家どうしの会話をシミュレートしてください。
専門家を選定してもらいますが、独創的な結論を出すために突拍子もない専門家を選定したり、堅実な結論を出すために堅実な専門家を選定したりするかはあなたの自由です。
"""


class 専門家同士の会話続きクエリプロキシ(QueryProxy):
    def __init__(self, 専門家同士の会話: ExpertConversation) -> None:
        self._クエリプロキシ = [
            # クエリ段落("キャラクター情報", vキャラクター情報.自分の情報),
            クエリ段落("専門家同士の会話", 専門家同士の会話),
            クエリ段落("指示文", self.指示文),
        ]

    @property
    def 指示文(self) -> str:
        return """
入力された専門家同士の会話をさらに続けてください。
"""
