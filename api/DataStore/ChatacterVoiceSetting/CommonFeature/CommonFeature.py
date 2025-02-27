
from enum import Enum


class AISentenceConverter(str,Enum):
    無効 = "無効"
    ChatGPT = "ChatGPT"
    gemini = "gemini"