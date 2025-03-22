
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody


class 思考結果から表現したいことへ加工するLLM:
    _llmBox:切り替え可能LLMBox

    def __init__(self):

        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考結果から表現したいことへ加工するLLM)
        self._llmBox.setSystemMessage(self.systemMessage)


    async def 加工する(self, v思考結果:思考結果)->PresentationByBody:
        """
        思考結果から表現したいことへ加工する
        """
        response = await self._llmBox.llmUnit.asyncGenerateResponse([v思考結果], PresentationByBody)
        if response is None or response == "テストモードです":
            raise Exception("加工に失敗しました")
        return response
        
    @property
    def systemMessage(self)->IMessageQuery:
        return IMessageQuery(
            id = "思考結果から表現したいことへ加工するLLMのシステムメッセージ",
            role="system",
            content="思考結果から表現したいことへ加工するLLMのシステムメッセージ"
        )