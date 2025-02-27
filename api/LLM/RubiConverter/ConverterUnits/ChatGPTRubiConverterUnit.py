from typing import Literal
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.OpenAI.ChatGptApiUnit import ChatGptApiUnit
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQuery
from api.LLM.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit
from api.LLM.RubiConverter.KanaText import KanaText



class ChatGPTRubiConverterUnit(IRubiConverterUnit):
    _gptUnit: ChatGptApiUnit
    _systemMessageQuery: MessageQuery
    _messageQueryHistory: list[MessageQuery]
    
    def __init__(self, systemMessage:str):
        self._gptUnit = ChatGptApiUnit(False)
        self._systemMessageQuery = {
            "role":"system",
            "content":systemMessage,
        }
    def convertAsync(self, text:str)->KanaText|Literal['テストモードです']|None:
        """
        フリガナ化文章を取得します
        """
        messageQuery = self._createMessageQuery(text)
        response = self._gptUnit.generateResponseStructured(messageQuery, KanaText)
        return response
    
    def _createMessageQuery(self, text:str) -> list[MessageQuery]:
        return [
            self._systemMessageQuery,
            {
                "role":"user",
                "content":f"入力:{text}",
            }
        ]
    
    
    
class AIRubiConverterTest:
    @staticmethod
    def test(mojiretu:str = "楕円関数のグラフを書くプログラムを書きたいな"):
        converter = ChatGPTRubiConverterUnit("")
        while True:
            moji = input("入力:")
            response = converter.convertAsync(moji)