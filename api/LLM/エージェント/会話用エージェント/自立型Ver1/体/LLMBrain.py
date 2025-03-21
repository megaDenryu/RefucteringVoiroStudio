
import asyncio

from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ


class LLMBrain:
    _v自分の情報:I自分の情報コンテナ
    _v会話履歴: I会話履歴
    def __init__(self, v自分の情報:I自分の情報コンテナ, v会話履歴:I会話履歴):
        self._v会話履歴 = v会話履歴
        self._v自分の情報 = v自分の情報

    async def イベント反応思考(self, messageUnit:MessageUnit) -> 思考結果:
        """ 
        会話をする
        """
        return await self.イベント反応思考テスト(messageUnit)
    async def イベント反応思考テスト(self, messageUnit:MessageUnit) -> 思考結果:
        # 5秒か10秒をランダムに選択
        import random
        wait_time = random.choice([5, 10])
        print(f"{wait_time}秒待機します...")  # デバッグ用（必要に応じて削除）
        await asyncio.sleep(wait_time)
        return 思考結果(結論 = f"{self._v自分の情報.id}が{messageUnit.message.text}に対して考えた結果", 感情="感情" , 理由="理由")

