from typing import Literal
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit
from api.LLM.RubiConverter.KanaText import KanaText


class GeminiRubiConverterUnit(IRubiConverterUnit):
    _geminiUnit: GeminiAPIUnit
    _systemMessage: str

    def __init__(self, systemMessage:str):
        self._geminiUnit = GeminiAPIUnit()
        self._systemMessage = systemMessage
        
    def convertAsync(self, text:str) -> KanaText|Literal['テストモードです']|None:
        """
        フリガナ化文章を取得します
        """
        response = self._geminiUnit.generateB(text, KanaText, self._systemMessage)
        return response