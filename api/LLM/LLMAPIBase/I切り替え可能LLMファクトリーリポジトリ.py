
from abc import ABC, abstractmethod
from typing import Dict
from api.LLM.LLMAPIBase.LLMType import LLMModelType
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox

class I切り替え可能LLMファクトリーリポジトリ(ABC):
    """切り替え可能LLMファクトリーリポジトリのインターフェース"""

    @abstractmethod
    def changeModel(self, llm_type: LLM用途タイプ, model: LLMModelType) -> None:
        """指定した用途に対してLLMモデルを切り替える"""
        pass

    @abstractmethod
    def changeAllModel(self, model: LLMModelType) -> None:
        """すべての用途に対してLLMモデルを切り替える"""
        pass

    @abstractmethod
    def getLLM(self, llm_type: LLM用途タイプ) -> 切り替え可能LLMBox:
        """指定した用途のLLMインスタンスを取得する"""
        pass