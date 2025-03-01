from abc import ABC, abstractmethod
from typing import Type, Literal, Union

from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import ILLMApiUnit
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageList, IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict
from api.LLM.LLMAPIBase.OpenAI.ChatGptApiUnit import ChatGptApiUnit
from api.LLM.エージェント.会話用エージェント.返答判定機.AnalysisResponse import AnalysisResponse
from api.LLM.エージェント.会話用エージェント.返答判定機.I返答判定機 import I返答判定機
from api.LLM.エージェント.会話用エージェント.返答判定機.UserInput import c完全入力, c未完全入力
from api.LLM.エージェント.会話用エージェント.返答判定機.パラメータ付判定モジュール.AIParameters import AIParameters


class LLM返答判定機(I返答判定機):
    def __init__(self, api_unit: ILLMApiUnit, ai_params: AIParameters, conversation_history: list[IMessageQuery]):
        self.api_unit = api_unit
        self.ai_params = ai_params
        self.conversation_history = conversation_history

    async def f判定(self, a未完全入力: c未完全入力) -> Union[c未完全入力, c完全入力]:
        buffer_text = a未完全入力.buffer_text

        # 会話履歴と発話をLLMに送信
        message_query:list[IMessageQuery] = self.conversation_history + [IMessageQuery(id = "1", role = "user", content = f"発話: \"{buffer_text}\"\n分析してください。")]
        system_message = IMessageQuery(id = "1",role = "system", content = "会話の分析を行います。")
        analysis = await self.api_unit.asyncGenerateResponse(message_query, AnalysisResponse, system_message)
        if isinstance(analysis, str) or analysis is None:
            return c未完全入力(buffer_text)

        # 意図とテンポに応じた調整
        if analysis.intent in ["ask_question", "seek_confirmation"]:
            analysis.should_respond = True

        self.ai_params.update_desire(analysis)
        self.ai_params.recover_energy()
        should_respond = self.ai_params.should_respond() and analysis.should_respond

        if analysis.is_complete and should_respond:
            return c完全入力(buffer_text, True)
        return c未完全入力(buffer_text)