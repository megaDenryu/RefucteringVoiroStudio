


from email.policy import default
from api.LLM.LLMAPIBase.I切り替え可能LLMファクトリーリポジトリ import I切り替え可能LLMファクトリーリポジトリ
from api.LLM.LLMAPIBase.LLMType import GeminiType, LLMModelType
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox


class 切り替え可能LLMファクトリーリポジトリ(I切り替え可能LLMファクトリーリポジトリ):
    _llm辞書:dict[LLM用途タイプ, 切り替え可能LLMBox] = {}
    _instance = None

    def __init__(self):
        default_model:LLMModelType = GeminiType.gemini2flash
        for llm_type in LLM用途タイプ:
            self._llm辞書[llm_type] = 切り替え可能LLMBox(default_model)

    @classmethod
    def singleton(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


    def changeModel(self, llm_type:LLM用途タイプ, model:LLMModelType):
        self._llm辞書[llm_type].changeModel(model)

    def changeAllModel(self, model:LLMModelType):
        for llm in self._llm辞書.values():
            llm.changeModel(model)

    def getLLM(self, llm_type:LLM用途タイプ) -> 切り替え可能LLMBox:
        return self._llm辞書[llm_type]