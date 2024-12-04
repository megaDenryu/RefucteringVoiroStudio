from pydantic import BaseModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ChatGptApiUnit import ChatGptApiUnit
from api.Extend.ExtendFunc import ExtendFunc

class KanaText(BaseModel):
    フリガナ化文章: str
    下ネタならtrue: bool

class AIRubiConverter:
    _gptUnit: ChatGptApiUnit
    _systemMessageQuery: list[ChatGptApiUnit.MessageQuery]
    _messageQueryHistory: list[ChatGptApiUnit.MessageQuery]
    def __init__(self):
        self._gptUnit = ChatGptApiUnit(False)
        self._systemMessageQuery = JsonAccessor.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel2"]
    def convertAsync(self, text:str) -> str|None:
        """
        フリガナ化文章を取得します
        """
        messageQuery = self.createMessageQuery(text)
        response = self._gptUnit.generateResponseStructured(messageQuery, KanaText)
        if response == "テストモードです":
            return "テストモードです"
        if response is None:
            return "エラーが発生しました"
        if response.下ネタならtrue:
            return "サイテー"
        ExtendFunc.ExtendPrintWithTitle("response",response)
        return AIRubiConverter.check(response.フリガナ化文章)
    
    def createMessageQuery(self, text:str) -> list[ChatGptApiUnit.MessageQuery]:
        return [
            self._systemMessageQuery[0],
            {
                "role":"user",
                "content":f"入力:{text}",
            }
        ]
    @staticmethod
    def check(text:str) -> str|None:
        if text == "":
            return None
        return text
    
class AIRubiConverterTest:
    @staticmethod
    def test(mojiretu:str = "楕円関数のグラフを書くプログラムを書きたいな"):
        converter = AIRubiConverter()
        while True:
            moji = input("入力:")
            response = converter.convertAsync(moji)