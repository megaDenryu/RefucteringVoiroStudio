from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.計画.思考アクション計画 import 思考アクション計画


class 思考アクション計画する人:
    _llmUnit:切り替え可能LLMBox
    def __init__(self):
        _llmUnit = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考アクション計画する人)

    def 計画を立てる(self, 状況履歴: list[IMessageQuery])->思考アクション計画:
        """
        与えられた状況履歴をもとに、次の計画を立てる
        """
        return 思考アクション計画()
