from pydantic import BaseModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.data_dir import DataDir
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ, LLM用途タイプ
from api.LLM.LLMAPIBase.システムメッセージ辞書 import システムメッセージ辞書

class DefaultシステムメッセージProxy:
    @staticmethod
    def path():
        return DataDir._().Default自立型ver1 / "Defaultシステムメッセージ.yml"
    @staticmethod
    def load()->システムメッセージ辞書:
        path = DefaultシステムメッセージProxy.path()
        data = JsonAccessor.loadYamlToBaseModel(path, システムメッセージ辞書)
        if data is None:
            raise ValueError("システムメッセージ辞書が読み込めませんでした。")
        return data