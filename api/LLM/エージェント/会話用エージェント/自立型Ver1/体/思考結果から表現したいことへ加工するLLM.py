
from email import message
import uuid
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy,クエリ段落
from api.LLM.LLMAPIBase.LLMInterface.IMessageQuery import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.LLM用途タイプ import LLM用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLM import 切り替え可能LLMBox
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody


class 思考結果から表現したいことへ加工するクエリプロキシ(QueryProxy):
    def __init__(self, 思考結果: 思考結果):
        super().__init__()
        self._クエリプロキシ = [
            クエリ段落("思考結果", 思考結果),
        ]
        self._思考結果 = 思考結果

    def カスタム出力(self) -> str:
        raise NotImplementedError("カスタム出力は実装されていません")

class 思考結果から表現したいことへ加工するLLM:
    _llmBox:切り替え可能LLMBox

    def __init__(self):

        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().getLLM(LLM用途タイプ.思考結果から表現したいことへ加工するLLM)
        self._llmBox.setSystemMessage(self.systemMessage)


    async def 加工する(self, v思考結果:思考結果)->PresentationByBody:
        """
        思考結果から表現したいことへ加工する
        """
        
        # return PresentationByBody(文章 = v思考結果.最新思考状態.思考内容, 感情="なし") # 仮の返り値
        加工クエリプロキシ = 思考結果から表現したいことへ加工するクエリプロキシ(v思考結果)
        response = await self._llmBox.llmUnit.asyncGenerateResponse(加工クエリプロキシ.json文字列でクエリ出力, PresentationByBody)
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