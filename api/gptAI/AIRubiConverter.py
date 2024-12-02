from api.Extend.ChatGptApiUnit import ChatGptApiUnit


class AIRubiConverter:
    _gptUnit: ChatGptApiUnit
    _messageQueryHistory: list[ChatGptApiUnit.MessageQuery]
    def __init__(self):
        self._gptUnit = ChatGptApiUnit()
    def convertAsync(self, text:str) -> str:
        raise NotImplementedError
    
    def createMessageQuery(self, text:str) -> ChatGptApiUnit.MessageQuery:
        return {
            "role":"user",
            "content":text
        }