from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.専門家が結論を出すモデル import 専門家が結論を出すモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import InternalMonologue
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴


class モデル連鎖思考:
    def __init__(self):
        pass
    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: 思考履歴, vキャラクター情報) -> BaseModel:
        自問自答モデル = 自問自答モジュール()
        自問自答結果:InternalMonologue = await 自問自答モデル.実行(v状況履歴, v思考履歴, vキャラクター情報)
        結論を出すモデル = 専門家が結論を出すモデル()
        結論を出す結果 = await 結論を出すモデル.問いに答える(自問自答結果)
        return 結論を出す結果
        