import asyncio
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.思考結果 import 思考結果
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.脳内思考プロセス import 脳内思考プロセス
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.体内信号機.体内信号機 import 体内信号機
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class LLMBrain:
    _v自分の情報:I自分の情報コンテナ
    _v会話履歴: I会話履歴
    _v体内信号機: 体内信号機
    _v脳内思考プロセス: 脳内思考プロセス
    def __init__(self, v自分の情報:I自分の情報コンテナ, v会話履歴:I会話履歴, v体内信号機:体内信号機):
        self._v会話履歴 = v会話履歴
        self._v自分の情報 = v自分の情報
        self._v体内信号機 = v体内信号機
        self._v脳内思考プロセス = 脳内思考プロセス(self._v自分の情報)

    async def イベント反応思考(self, messageUnits:list[MessageUnitVer1]) -> 思考結果:
        """ 
        会話をする
        """
        return await self._イベント反応思考テスト(messageUnits)
    async def _イベント反応思考テスト(self, messageUnits:list[MessageUnitVer1]) -> 思考結果:
        # 5秒か10秒をランダムに選択
        import random
        wait_time = random.choice([5, 10])
        print(f"{wait_time}秒待機します...")  # デバッグ用（必要に応じて削除）
        await asyncio.sleep(wait_time)

        # 思考手続きモデル
        await self._v脳内思考プロセス.脳内思考プロセスを進める(messageUnits)
        v最新思考状態 = self._v脳内思考プロセス.最新の思考状態
        return 思考結果(最新思考状態=v最新思考状態)
        # return 思考結果(結論 = f"{self._v自分の情報.id}が{messageUnits[-1].message.text}に対して考えた結果", 感情="感情" , 理由="理由", )

    def 脳内で表現する(self, 脳内表現イベント: I脳内表現イベント):
        """
        いうのに失敗したことなどを心の中で言って脳内状態を更新しておく。例：○○て言おうと思ったのに言えなかった。
        non-blockingで行うので create_task などで非同期で実行する。

        脳内思考プロセスなどにアプローチしたい。
        """
        self._v脳内思考プロセス.プロセス材料に変換して溜める(脳内表現イベント)



