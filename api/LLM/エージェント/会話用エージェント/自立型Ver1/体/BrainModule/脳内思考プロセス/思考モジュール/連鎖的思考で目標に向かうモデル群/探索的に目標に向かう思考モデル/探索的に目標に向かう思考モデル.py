from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.Extend.ExtendFunc import TimeExtend
from api.LLM.LLMAPIBase.LLM用途タイプ import LLMs用途タイプ
from api.LLM.LLMAPIBase.切り替え可能LLMファクトリーリポジトリ import 切り替え可能LLMファクトリーリポジトリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.創造的連想モジュール import 創造的連想モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.専門家が結論を出すモデル import 専門家が結論を出すモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.思考用クエリ import 深層的自問自答クエリプロキシ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.追伸クエリ import 追伸クエリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.連鎖的思考で目標に向かうモデル群.ゴールグラフモデル.思考ゴールグラフモデル import 思考ゴールグラフモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.連鎖的思考で目標に向かうモデル群.探索的に目標に向かう思考モデル.出力BaseModel import GoalCheckResult
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.連鎖的思考で目標に向かうモデル群.探索的に目標に向かう思考モデル.目標達成確認クエリ import 目標達成確認クエリ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.記憶部署.I記憶部署 import I記憶部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ

class 探索的に目標に向かう思考モデル(Iキャラ依存思考モデル):
    def __init__(self) -> None:
        self._llmBox = 切り替え可能LLMファクトリーリポジトリ.singleton().createLLMs(LLMs用途タイプ.探索的に目標に向かう思考モデル)

    async def 実行(self, v状況履歴: 状況履歴, v記憶部署: I記憶部署, vキャラクター情報: I自分の情報コンテナ,追伸:IModelDumpAble|str|None = None) -> IModelDumpAble:
        while True:
            確認結果 = await self.思考1ステップ目(v状況履歴, v記憶部署, vキャラクター情報, 追伸)
            if 確認結果.判定結果 == True:
                continue

    async def 思考1ステップ目(self, v状況履歴: 状況履歴, v記憶部署: I記憶部署, vキャラクター情報: I自分の情報コンテナ, 追伸:IModelDumpAble|str|None = None) -> GoalCheckResult:
        """
        探索的に目標に向かう思考モデルを実行する。
        - 試行錯誤：「やってみて、問題が出たら修正する」というプロセスを繰り返す。
        - 未知の状況で道を探すようなイメージ
        - できそうなことからやってみる
        というようなことを実現する。
        なのでこれのためには自問と自答と連想が必要になる。しかし連想には指向性がある。なのでどのようなことを連想するか、その方向性が必要になる、そしてそれはAIが考える必要がある。
        (目標1、自問1) -> (目標2、連想or計画or行動) ->  (目標2、確認) -> (目標3、自問or修正)
        """
        v自問自答モデル = 自問自答モジュール()
        v連想モデル = 創造的連想モジュール()
        v計画思考グラフモデル = 思考ゴールグラフモデル()
        v脳内会議モデル = 専門家が結論を出すモデル()
        目標が入ってるであろう自問自答の形跡 = await v自問自答モデル.実行(v状況履歴, v記憶部署, vキャラクター情報, "今の状況で考えるべき最重要な目標を認識するよう努めてください。")
        秒数 = TimeExtend.nowSecond()
        秒数を3で割った余り = 秒数 % 3
        結果: IModelDumpAble
        if 秒数を3で割った余り == 0:
            # 目標が入っているであろう自問自答の形跡を元に連想する
            v追伸クエリ = 追伸クエリ([目標が入ってるであろう自問自答の形跡,"目標を満たすために、目標に関連しそうなことを色々連想してみてください。"])
            結果 = await v連想モデル.実行(v状況履歴, v記憶部署, vキャラクター情報, v追伸クエリ)
        elif 秒数を3で割った余り == 1:
            # 目標が入っているであろう自問自答の形跡を元に連想する
            v追伸クエリ = 追伸クエリ([目標が入ってるであろう自問自答の形跡,"目標を満たすための考える手順の計画を立てて考えてみてください。"])
            結果 = await v計画思考グラフモデル.実行(v状況履歴, v記憶部署, vキャラクター情報, v追伸クエリ)
        elif 秒数を3で割った余り == 2:
            # 目標が入っているであろう自問自答の形跡を元に連想する
            v追伸クエリ = 追伸クエリ([目標が入ってるであろう自問自答の形跡,"目標を満たす結論を考えてください。"])
            結果 = await v脳内会議モデル.実行(v状況履歴, v記憶部署, vキャラクター情報, v追伸クエリ)
        else:
            raise ValueError("Unexpected value for 秒数を3で割った余り")
        v目標達成確認クエリ = 目標達成確認クエリ(目標が入ってるであろう自問自答の形跡,結果)
        確認結果 = await self._llmBox.llmUnit.asyncGenerateResponse(v目標達成確認クエリ.json文字列でクエリ出力, GoalCheckResult)
        if isinstance(確認結果, GoalCheckResult):
            return 確認結果
        raise TypeError("思考ノードの結果がlistではありません")
        


        
