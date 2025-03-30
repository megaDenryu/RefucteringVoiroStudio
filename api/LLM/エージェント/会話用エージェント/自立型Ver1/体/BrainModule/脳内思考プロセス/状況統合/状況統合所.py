
from uuid import uuid4
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.プロセス材料.プロセス材料を包んだもの import プロセス材料を包んだもの
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況リスト

class 状況統合所:
    _状況履歴: list[状況]
    def __init__(self):
        self._状況履歴 = []
    def 思考可能な形に状況を整理して変換(self, 溜まってたプロセス材料: list[プロセス材料を包んだもの], 最新メッセージ: list[MessageUnitVer1]) -> 状況リスト:
        new状況 = 状況.並び替え(self.材料を状況に変換(溜まってたプロセス材料) + self.メッセージを状況に変換(最新メッセージ))
        self._状況履歴 += new状況
        return 状況リスト(self._状況履歴)
        

    def 材料を状況に変換(self, 溜まってたプロセス材料: list[プロセス材料を包んだもの]) -> list[状況]:
        状況リスト: list[状況] = []
        for 材料 in 溜まってたプロセス材料:
            状況オブジェクト = 状況(時間=材料.time, 内容=材料.状況内容として報告())
            状況リスト.append(状況オブジェクト)
        return 状況リスト
    
    def メッセージを状況に変換(self, 最新メッセージ: list[MessageUnitVer1]) -> list[状況]:
        状況リスト: list[状況] = []
        for メッセージ in 最新メッセージ:
            状況オブジェクトn = 状況(時間=メッセージ.time, 内容=メッセージ.状況内容として報告())
            状況リスト.append(状況オブジェクトn)
        return 状況リスト