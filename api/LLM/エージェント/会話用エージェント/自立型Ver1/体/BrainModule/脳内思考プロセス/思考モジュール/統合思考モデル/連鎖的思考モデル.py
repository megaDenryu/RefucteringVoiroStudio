from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.専門家が結論を出すモデル import 専門家が結論を出すモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.報酬ベクトル生成モデル import 感情ベクトル生成モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import InternalMonologue
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ

class モデル連鎖思考:
    def __init__(self):
        pass
    async def 実行(self, v状況履歴:状況履歴, v思考履歴:思考履歴, vキャラクター情報:I自分の情報コンテナ) -> BaseModel:
        自問自答モデル = 自問自答モジュール()
        自問自答結果:InternalMonologue = await 自問自答モデル.実行(v状況履歴, v思考履歴, vキャラクター情報)
        結論を出すモデル = 専門家が結論を出すモデル(私の名前=vキャラクター情報.id)
        結論 = await 結論を出すモデル.問いに答える(自問自答結果)
        v感情ベクトル生成モデル = 感情ベクトル生成モデル()
        報酬 = await v感情ベクトル生成モデル.生成する2([v状況履歴, v思考履歴, 結論])
        return 報酬
        