
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.Iしゃべるための口 import I表現機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBody import LLMHumanBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者


class 体を持つ者example(I体を持つ者, I表現機構):
    _id:str
    _会話履歴: I会話履歴
    _llmHumanBody: LLMHumanBody
    _llmHumanBodyInput: LLMHumanBodyInput
    def __init__(self,id:str):
        self._id = id
        pass
    # def __init__(self, 会話履歴: I会話履歴):
    #     self._会話履歴 = 会話履歴
    #     self._llmHumanBodyInput = {"会話履歴": self._会話履歴,"表現機構": self}
    #     self._llmHumanBody = LLMHumanBody(input=self._llmHumanBodyInput)
    #     self._会話履歴.addOnMessage(self._llmHumanBody.イベント反応メインプロセス)
        
    
    @property
    def llmHumanBody(self)->LLMHumanBody:
        return self.llmHumanBody

    @property
    def llmHumanBodyInput(self)->LLMHumanBodyInput:
        return self.llmHumanBodyInput
    
    def 会話履歴注入(self, 会話履歴: I会話履歴):
        self._会話履歴 = 会話履歴
        self._llmHumanBodyInput = {"会話履歴": self._会話履歴,"表現機構": self}
        self._llmHumanBody = LLMHumanBody(input=self._llmHumanBodyInput)
        self._会話履歴.addOnMessage(self._llmHumanBody.イベント反応メインプロセス)
    
