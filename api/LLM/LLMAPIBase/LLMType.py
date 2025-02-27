from enum import Enum


class LLMType(Enum):
    ChatGPT = "chatgpt"
    Gemini = "gemini"

class ChatGPTType(Enum):
    o1mini = "o1-mini"
    o1preview = "o1-preview"

class GeminiType(Enum):
    gemini2flash = "gemini-2.0-flash"