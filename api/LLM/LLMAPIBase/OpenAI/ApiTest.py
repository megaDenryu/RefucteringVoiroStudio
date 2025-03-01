from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict, QueryConverter
from api.LLM.エージェント.RubiConverter.KanaText import KanaText


def test():
    unit = GeminiAPIUnit()
    unit = GeminiAPIUnit(False, )
    system_message_query:MessageQueryDict = JsonAccessor.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel"][0]
    print(type(system_message_query))
    system_message:str = system_message_query["content"] 

    while True:
        text = input("テキストを入力してください。")
        response = unit.generateResponse(
            [IMessageQuery(id = "1", role = "user", content = text)],
            KanaText,
            QueryConverter.toMessageQuery(system_message_query, "2")
        )
        ExtendFunc.ExtendPrint(response)