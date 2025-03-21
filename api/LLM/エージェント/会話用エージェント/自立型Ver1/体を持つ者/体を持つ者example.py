
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.I表現機構 import I表現機構
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBody import LLMHumanBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報 import 自分の情報コンテナ


class 体を持つ者example(I体を持つ者):
    _自分の情報:自分の情報コンテナ
    _会話履歴: I会話履歴
    _llmHumanBody: LLMHumanBody
    _llmHumanBodyInput: LLMHumanBodyInput
    def __init__(self,id:str):
        self._自分の情報 = 自分の情報コンテナ(id)
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
    
    @property
    def 自分の情報(self)->自分の情報コンテナ:
        return self._自分の情報
    
    def 会話履歴注入(self, 会話履歴: I会話履歴):
        self._会話履歴 = 会話履歴
        self._llmHumanBodyInput = {"会話履歴": self._会話履歴,"表現機構": self, "自分の情報": self._自分の情報}
        self._llmHumanBody = LLMHumanBody(input=self._llmHumanBodyInput)
        self._会話履歴.addOnMessage(self._llmHumanBody.イベント反応メインプロセス)

    def 表現する(self, 表現したいこと:PresentationByBody):
        ExtendFunc.ExtendPrint(表現したいこと)
    
    def しゃべる(self, message:str):
        ExtendFunc.ExtendPrint(message)
    
    
