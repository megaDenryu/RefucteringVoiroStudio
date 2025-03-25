
from uuid import uuid4
from pydantic import BaseModel
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況


class Compass(BaseModel):
    人生の方針:str
    十年後の夢:str
    今月やりたいこと:str
    今月の義務:str
    今日やりたいこと:str
    今日の義務:str
    今日の気持ち:str
    今日の人間関係:str
    今日の体調:str

class 方針策定input:
    状況履歴:list[状況]
    

class 方針策定LLM:
    _llmUnit:切り替え可能LLMBox
    def __init__(self) -> None:
        self._llmUnit = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.方針策定)
        self._llmUnit.setSystemMessage(IMessageQuery(
            id = str(uuid4()),
            content = "状況履歴に基づいて方針を策定します。",
            role = "system"
        ))
    async def 方針を策定する(self, input:方針策定input)->Compass:
        retData = await self._llmUnit.llmUnit.asyncGenerateResponse(input.状況履歴, Compass)
        

