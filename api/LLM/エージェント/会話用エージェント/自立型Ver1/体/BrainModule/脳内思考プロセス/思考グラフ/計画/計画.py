from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ


class 計画LLM:
    _llmUnit:切り替え可能LLMBox
    def __init__(self):
        _llmUnit = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.計画)

    def 計画を立てる(self, 状況履歴: list[IMessageQuery])->list[計画構想]:
        """
        与えられた状況履歴をもとに、次の計画を立てる
        """
