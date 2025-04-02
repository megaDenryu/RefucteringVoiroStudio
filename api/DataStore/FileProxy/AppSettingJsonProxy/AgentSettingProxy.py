from api.DataStore.FileProxy.AppSettingJsonProxy.AppSettingJsonProxy import AppSettingJsonProxy


class AgentSettingProxy:
    @staticmethod
    def load():
        return AppSettingJsonProxy.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel"][0]
    
    @staticmethod
    def load1():
        return AppSettingJsonProxy.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModel2"]
    
    @staticmethod
    def load2():
        return AppSettingJsonProxy.loadAppSettingYamlAsReplacedDict("AgentSetting.yml",{})["音声認識フリガナエージェントBaseModelForGemini"]