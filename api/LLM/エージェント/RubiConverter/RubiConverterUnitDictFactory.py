

from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict
from api.LLM.RubiConverter.ConverterUnits.GeminiRubiConverterUnit import GeminiRubiConverterUnit
from api.LLM.RubiConverter.ConverterUnits.ChatGPTRubiConverterUnit import ChatGptRubiConverter
from api.LLM.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit


def factory():
    system_message_query:MessageQueryDict = JsonAccessor.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel2"]
    system_message:str = system_message_query["content"]
    unit_dict:dict[AISentenceConverter,IRubiConverterUnit] = {
        AISentenceConverter.ChatGPT:ChatGptRubiConverter(system_message),
        AISentenceConverter.gemini:GeminiRubiConverterUnit(system_message)
    }

    return unit_dict