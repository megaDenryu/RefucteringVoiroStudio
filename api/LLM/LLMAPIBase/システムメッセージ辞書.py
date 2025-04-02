from pydantic import BaseModel

from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ, LLM用途タイプ


class システムメッセージ辞書(BaseModel):
    llmシステムメッセージ辞書: dict[LLM用途タイプ, IMessageQuery]
    llmsシステムメッセージ辞書: dict[LLMs用途タイプ, IMessageQuery]