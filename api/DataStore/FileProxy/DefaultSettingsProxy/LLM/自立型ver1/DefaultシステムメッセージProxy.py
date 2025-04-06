from calendar import c
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
    
    @staticmethod
    def saveEmptyData():
        path = DefaultシステムメッセージProxy.path()
        llmシステムメッセージ辞書 = {}
        llmsシステムメッセージ辞書 = {}
        for llm_type in LLM用途タイプ:
            llmシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        for llm_type in LLMs用途タイプ:
            llmsシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        # デフォルトのシステムメッセージ辞書を保存
        data = システムメッセージ辞書(
            llmシステムメッセージ辞書= llmシステムメッセージ辞書,
            llmsシステムメッセージ辞書= llmsシステムメッセージ辞書
        )
        JsonAccessor.saveYamlFromBaseModel(path, data)
    
    @classmethod
    def 用途タイプが追加されたので更新(cls):
        path = DefaultシステムメッセージProxy.path()
        data = cls.load()
        llmシステムメッセージ辞書 = data.llmシステムメッセージ辞書
        llmsシステムメッセージ辞書 = data.llmsシステムメッセージ辞書
        # 新しい用途タイプを追加
        for llm_type in LLM用途タイプ:
            if llm_type not in llmシステムメッセージ辞書:
                llmシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        for llm_type in LLMs用途タイプ:
            if llm_type not in llmsシステムメッセージ辞書:
                llmsシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        # 更新されたシステムメッセージ辞書を保存
        data = システムメッセージ辞書(
            llmシステムメッセージ辞書=llmシステムメッセージ辞書,
            llmsシステムメッセージ辞書=llmsシステムメッセージ辞書
        )
        JsonAccessor.saveYamlFromBaseModel(path, data)
