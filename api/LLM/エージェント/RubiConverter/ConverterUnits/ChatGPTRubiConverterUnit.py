from typing import Literal
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.OpenAI.ChatGptApiUnit import ChatGptApiUnit
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict
from api.LLM.エージェント.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit
from api.LLM.エージェント.RubiConverter.KanaText import KanaText



class ChatGptRubiConverter(IRubiConverterUnit):
    _gptUnit: ChatGptApiUnit
    _systemMessageQuery: MessageQueryDict
    _messageQueryHistory: list[MessageQueryDict]
    
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
    
    def _createMessageQuery(self, text:str) -> list[MessageQueryDict]:
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
        converter = ChatGptRubiConverter("")
        while True:
            moji = input("入力:")
            response = converter.convertAsync(moji)