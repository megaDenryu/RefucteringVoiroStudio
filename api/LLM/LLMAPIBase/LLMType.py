from enum import Enum


class LLMType(Enum):
    ChatGPT = "chatgpt"
    Gemini = "gemini"

class ChatGPTType(Enum):
    gpt4o = "gpt-4o"
    gptp4o_mini = "gpt-4o-mini"

class GeminiType(Enum):
    gemini2flash = "gemini-2.0-flash"
    gemini2flash_exp = "gemini-2.0-flash-exp"
    gemini2flash_lite = "gemini-2.0-flash-lite"
    gemini2flash_lite_prev = "gemini-2.0-flash-lite-preview-02-05"
    gemini2flash_thinking = "gemini-2.0-flash-thinking-exp-01-21"

LLMModelType = ChatGPTType | GeminiType