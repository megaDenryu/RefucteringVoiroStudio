from typing import Literal
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.エージェント.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit
from api.LLM.エージェント.RubiConverter.KanaText import KanaText


class GeminiRubiConverterUnit(IRubiConverterUnit):
    _geminiUnit: GeminiAPIUnit
    _systemMessage: str

    def __init__(self, systemMessage:str):
        self._geminiUnit = GeminiAPIUnit(False)
        self._systemMessage = systemMessage
        
    async def convertAsync(self, text:str) -> KanaText|Literal['テストモードです']|None:
        """
        フリガナ化文章を取得します
        """
        response = await self._geminiUnit.asyncGenerateB(text, KanaText, self._systemMessage)
        return response