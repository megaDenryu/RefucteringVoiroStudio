from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.LLMAPIBase.OpenAI.ChatGptApiUnit import ChatGptApiUnit
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM返答判定機 import LLM返答判定機
from api.LLM.エージェント.会話用エージェント.返答判定機.パラメータ付判定モジュール.AIParameters import AIParameters


class LLM判定機ファクトリー:
    @staticmethod
    def Gemini判定機作成():
        gemini_api_unit = GeminiAPIUnit(False)
        return LLM返答判定機(gemini_api_unit, AIParameters(), [])
    
    @staticmethod
    def ChatGpt判定機作成():
        chatgpt_api_unit = ChatGptApiUnit(False)
        return LLM返答判定機(chatgpt_api_unit, AIParameters(), [])