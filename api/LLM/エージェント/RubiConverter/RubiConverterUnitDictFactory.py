from re import A
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.FileProxy.AppSettingJsonProxy.AgentSettingProxy import AgentSettingProxy
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict
from api.LLM.エージェント.RubiConverter.AIRubiConverter import AIRubiConverter
from api.LLM.エージェント.RubiConverter.ConverterUnits.ChatGPTRubiConverterUnit import ChatGptRubiConverter
from api.LLM.エージェント.RubiConverter.ConverterUnits.GeminiRubiConverterUnit import GeminiRubiConverterUnit
from api.LLM.エージェント.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit




class AIRubiConverterFactory:
    @staticmethod
    def create():
        return AIRubiConverter(AIRubiConverterFactory.factory())
    
    @staticmethod
    def factory():
        system_message_queryChatGpt:list[MessageQueryDict] = AgentSettingProxy.load1()
        system_messageChatGpt:str = system_message_queryChatGpt[0]["content"]
        system_message_queryGemini:list[MessageQueryDict] = AgentSettingProxy.load2()
        system_messageGemini:str = system_message_queryGemini[0]["content"]

        unit_dict:dict[AISentenceConverter,IRubiConverterUnit] = {
            AISentenceConverter.ChatGPT:ChatGptRubiConverter(system_messageChatGpt),
            AISentenceConverter.Gemini:GeminiRubiConverterUnit(system_messageGemini)
        }

        return unit_dict