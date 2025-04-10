from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.創造的連想モジュール import 創造的連想モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モジュール種類 import ThinkingModuleEnum
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考選択モデル.思考選択モデル import 思考選択モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 思考選択実行モジュール:
    def __init__(self) -> None:
        self._思考選択モデル = 思考選択モデル()

    async def 選択的思考を実行する(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報:I自分の情報コンテナ) -> BaseModel:
        """
        与えられた状況履歴をもとに、選択的思考を行う
        """
        v選択結果:ThinkingModuleEnum = await self._思考選択モデル.思考の種類を適当に選ぶ(v状況履歴, v思考履歴)
        if v選択結果 == ThinkingModuleEnum.深層的自問自答モデル:
            v自問自答モジュール = 自問自答モジュール()
            result = await v自問自答モジュール.実行(v状況履歴, v思考履歴, vキャラクター情報)
            return result
        elif v選択結果 == ThinkingModuleEnum.創造的連想モデル:
            v創造的連想モジュール = 創造的連想モジュール()
            result = await v創造的連想モジュール.実行(v状況履歴, v思考履歴, vキャラクター情報)
            return result