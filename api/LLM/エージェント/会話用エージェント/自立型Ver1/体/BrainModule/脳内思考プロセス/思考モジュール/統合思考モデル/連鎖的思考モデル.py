from pydantic import BaseModel
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.専門家が結論を出すモデル import 専門家が結論を出すモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.報酬ベクトル生成モデル import 感情ベクトル生成モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モジュール種類 import ThinkingModuleEnum
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import InternalMonologue
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ

class モデル連鎖思考(Iキャラ依存思考モデル):
    def __init__(self):
        pass
    async def 実行(self, v状況履歴:状況履歴, v記憶部署:I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> BaseModel:
        自問自答モデル = 自問自答モジュール()
        結論を出すモデル = 専門家が結論を出すモデル()
        v感情ベクトル生成モデル = 感情ベクトル生成モデル()


        自問自答結果:InternalMonologue = await 自問自答モデル.実行(v状況履歴, v記憶部署, vキャラクター情報)
        結論 = await 結論を出すモデル.問いに答える(自問自答結果,vキャラクター情報.id)
        報酬 = await v感情ベクトル生成モデル.状況から実際に受け取る報酬を生成する([v状況履歴, v記憶部署, 結論])
        return 報酬
    
    async def 人間が行う思考方法には連想と自問自答と脳内会議と計画的で段階的な思考と無計画だが目標に向かう思考がありそれらをランダムに行う(self, v状況履歴:状況履歴, v記憶部署:I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> BaseModel:
        思考の種類の辞書 = {
            ThinkingModuleEnum.連想思考: self.実行,
            ThinkingModuleEnum.自問自答: self.実行,
            ThinkingModuleEnum.脳内会議: self.実行,
            ThinkingModuleEnum.計画的思考: self.実行,
            ThinkingModuleEnum.無計画思考: self.実行
        }
        