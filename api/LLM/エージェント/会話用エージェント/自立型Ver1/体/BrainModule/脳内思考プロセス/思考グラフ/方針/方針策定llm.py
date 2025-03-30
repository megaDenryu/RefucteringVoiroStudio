
from uuid import uuid4
import uuid
from pydantic import BaseModel
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針object import Compass, 方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針策定input import 方針策定input
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況

class 方針策定LLM:
    _llmUnit:切り替え可能LLMBox
    _方針履歴:list[方針]
    def __init__(self) -> None:
        self._llmUnit = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.方針策定)
        self._llmUnit.setSystemMessage(IMessageQuery(
            id = str(uuid4()),
            content = "状況履歴に基づいて方針を策定します。",
            role = "system"
        ))
    async def 方針を策定する(self, input:方針策定input):
        messageQuery = [IMessageQuery(id=str(uuid4()),role="user",content=状況.リスト化文章(input.状況履歴))]
        
        retData = await self._llmUnit.llmUnit.asyncGenerateResponse(messageQuery, Compass)
        return retData
    
    @property
    def 現在方針(self)->方針:
        """
        最新の方針を取得する
        """
        return self._方針履歴[-1]
        

