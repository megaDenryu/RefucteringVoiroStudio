from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import ILLMApiUnit
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLMType import ChatGPTType, LLMModelType
from api.LLM.LLMAPIBase.OpenAI.ChatGptApiUnit import ChatGptApiUnit



class 切り替え可能LLMBox:
    llmUnit: ILLMApiUnit
    _mode: LLMModelType
    _system_message:IMessageQuery|None = None
    def __init__(self, mode:LLMModelType):
        self._mode = mode
        self.llmUnit = self.createLLMUnit(mode)

    def createLLMUnit(self, mode:LLMModelType) -> ILLMApiUnit:
        # if mode is ChatGPTType
        if isinstance(mode, ChatGPTType):
            return ChatGptApiUnit(test_mode = False, model = mode)
        else:
            return GeminiAPIUnit(test_mode = False, model = mode)
        
    def setSystemMessage(self, system_message:IMessageQuery):
        self._system_message = system_message
        if self.llmUnit is not None:
            self.llmUnit.setSystemMessage(system_message)
        return self

    def changeModel(self, model:LLMModelType):
        self._mode = model
        self.llmUnit = self.createLLMUnit(model)
        if self._system_message is not None:
            self.llmUnit.setSystemMessage(self._system_message)


    