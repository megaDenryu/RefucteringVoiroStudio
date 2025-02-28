

from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.DataStore.JsonAccessor import JsonAccessor
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQuery
from api.LLM.RubiConverter.ConverterUnits.GeminiRubiConverterUnit import GeminiRubiConverterUnit
from api.LLM.RubiConverter.ConverterUnits.ChatGPTRubiConverterUnit import AIRubiConverter
from api.LLM.RubiConverter.ConverterUnits.IRubiConverterUnit import IRubiConverterUnit


def factory():
    system_message_query:MessageQuery = JsonAccessor.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel2"]
    system_message:str = system_message_query["content"]
    unit_dict:dict[AISentenceConverter,IRubiConverterUnit] = {
        AISentenceConverter.ChatGPT:AIRubiConverter(system_message),
        AISentenceConverter.gemini:GeminiRubiConverterUnit(system_message)
    }

    return unit_dict