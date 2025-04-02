from api.DataStore.FileProxy.DefaultSettingsProxy.LLM.自立型ver1.DefaultシステムメッセージProxy import システムメッセージ辞書
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.data_dir import DataDir


class システムメッセージProxy:
    @staticmethod
    def path():
        return DataDir._().自立型ver1 / "システムメッセージ.yml"
    @staticmethod
    def load()->システムメッセージ辞書|None:
        path = システムメッセージProxy.path()
        data = JsonAccessor.loadYamlToBaseModel(path, システムメッセージ辞書)
        return data
    
    @staticmethod
    def save(data:システムメッセージ辞書) -> None:
        path = システムメッセージProxy.path()
        JsonAccessor.saveYamlFromBaseModel(path, data)