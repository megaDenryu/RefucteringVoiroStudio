import sys

from pydantic import BaseModel

from api.DataStore.FileProxy.DefaultSettingsProxy.LLM.自立型ver1.DefaultシステムメッセージProxy import DefaultシステムメッセージProxy
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ, LLM用途タイプ
from api.LLM.LLMAPIBase.システムメッセージ辞書 import システムメッセージ辞書

class SystemMessageリポジトリ:
    _llmシステムメッセージ辞書: dict[LLM用途タイプ, IMessageQuery] = {}
    _llmsシステムメッセージ辞書: dict[LLMs用途タイプ, IMessageQuery] = {}

    def __init__(self) -> None:
        vシステムメッセージ辞書 = self._tryLoadSystemMessage辞書()
        self._llmシステムメッセージ辞書 = vシステムメッセージ辞書.llmシステムメッセージ辞書
        self._llmsシステムメッセージ辞書 = vシステムメッセージ辞書.llmsシステムメッセージ辞書

    def getSystemMessage(self, llm_type: LLM用途タイプ|LLMs用途タイプ) -> IMessageQuery:
        if isinstance(llm_type, LLM用途タイプ):
            if llm_type in self._llmシステムメッセージ辞書:
                return self._llmシステムメッセージ辞書[llm_type]
            else:
                raise KeyError(f"指定された用途のシステムメッセージが見つかりません: {llm_type}")
        elif isinstance(llm_type, LLMs用途タイプ):
            if llm_type in self._llmsシステムメッセージ辞書:
                return self._llmsシステムメッセージ辞書[llm_type]
            else:
                raise KeyError(f"指定された用途のシステムメッセージが見つかりません: {llm_type}")
    

    def changeMessage(self, llm_type: LLM用途タイプ|LLMs用途タイプ, system_message: IMessageQuery) -> None:
        """
        指定した用途のシステムメッセージを変更する
        """
        if isinstance(llm_type, LLM用途タイプ):
            self._llmシステムメッセージ辞書[llm_type].content = system_message.content
        elif isinstance(llm_type, LLMs用途タイプ):
            self._llmsシステムメッセージ辞書[llm_type].content = system_message.content
        self._saveSystemMessage辞書()
    
    def changeMessages(self, system_messages: dict[LLM用途タイプ|LLMs用途タイプ, IMessageQuery]) -> None:
        """
        指定した用途のシステムメッセージを変更する
        """
        for llm_type, system_message in system_messages.items():
            self.changeMessage(llm_type, system_message)
        self._saveSystemMessage辞書()


    def _tryLoadSystemMessage辞書(self) -> システムメッセージ辞書:
        
        data = DefaultシステムメッセージProxy.load()
        raise NotImplementedError("システムメッセージ辞書の読み込みは未実装です。")
        vシステムメッセージ辞書:システムメッセージ辞書 = システムメッセージ辞書()
        return vシステムメッセージ辞書


    def _saveSystemMessage辞書(self) -> None:
        """
        システムメッセージ辞書を保存する
        """
        pass

    def 初期データとファイルを作成して保存(self) -> None:
        llmシステムメッセージ辞書 = {}
        llmsシステムメッセージ辞書 = {}
        for llm_type in LLM用途タイプ:
            llmシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        for llm_type in LLMs用途タイプ:
            llmsシステムメッセージ辞書[llm_type] = IMessageQuery.systemMessage("")
        システムメッセージ:システムメッセージ辞書 = システムメッセージ辞書(
            llmシステムメッセージ辞書=llmシステムメッセージ辞書,
            llmsシステムメッセージ辞書=llmsシステムメッセージ辞書
        )
