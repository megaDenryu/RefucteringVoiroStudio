from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict
from api.LLM.エージェント.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit

class AIRubiConverter:
    llm_unit_dict:dict[AISentenceConverter,IRubiConverterUnit]
    mode: AISentenceConverter = AISentenceConverter.無効
    def __init__(self, llm_unit_dict:dict[AISentenceConverter,IRubiConverterUnit]):
        self.llm_unit_dict = llm_unit_dict
        
    async def convertAsync(self, text:str)->str|None:
        if self.mode == AISentenceConverter.無効:
            return text
        response = await self.llm_unit_dict[self.mode].convertAsync(text)
        if response == "テストモードです":
            return "テストモードです"
        if response is None:
            return "エラーが発生しました"
        if response.下ネタならtrue:
            return "サイテー"
        ExtendFunc.ExtendPrintWithTitle("response",response)
        return AIRubiConverter._check(response.最終出力ユーザーの発言のフリガナ化文章)
    
    def setMode(self, mode:AISentenceConverter):
        self.mode = mode
        return self

    @staticmethod
    def _check(text:str) -> str|None:
        if text == "":
            return None
        return text
    
        