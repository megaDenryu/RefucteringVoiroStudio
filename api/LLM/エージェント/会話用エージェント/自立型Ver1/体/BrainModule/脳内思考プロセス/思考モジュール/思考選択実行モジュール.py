from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モデルファクトリ import 思考モデルファクトリー
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考選択モデル.思考選択モデル import 思考選択モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ


class 思考選択実行モジュール(Iキャラ依存思考モデル):
    def __init__(self) -> None:
        self._思考選択モデル = 思考選択モデル()

    async def 実行(self, v状況履歴: 状況履歴, v思考履歴: I記憶部署, vキャラクター情報:I自分の情報コンテナ) -> IModelDumpAble:
        """
        与えられた状況履歴をもとに、選択的思考を行う。思考方法の分類が必要。
        とりあえず書き出すと、
        1. 深層的自問自答モデル
        2. 創造的連想モデル
        3. 直感的思考モデル
        4. 反射的思考モデル
        5. 分析的思考モデル
        6. 批判的思考モデル
        7. 発散的思考モデル
        8. 集中的思考モデル

        """
        v選択結果 = await self._思考選択モデル.実行(v状況履歴, v思考履歴, vキャラクター情報)
        思考モデル = 思考モデルファクトリー.作成(v選択結果.b思考方法)
        return await 思考モデル.実行(v状況履歴, v思考履歴, vキャラクター情報)
        