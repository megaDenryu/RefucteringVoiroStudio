from tkinter import E
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.思考グラフ部署 import 思考グラフ部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考履歴 import 思考履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.状況統合.状況オブジェクト import 状況, 状況リスト, 状況履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.自分の情報 import 自分の情報コンテナ


class 思考グラフテスト:
    @classmethod
    async def test(cls):
        _v自分の情報 = 自分の情報コンテナ(id="結月ゆかり")
        _思考グラフ部署 = 思考グラフ部署(_v自分の情報)
        _v状況履歴:状況履歴 = 状況履歴(
            前状況 = 状況リスト([状況(時間=TimeExtend(),内容="私今から戦車ゲームで戦車にのるんで",)]),
            新状況 = 状況リスト([状況(時間=TimeExtend(),内容="あ",)]),
        )
        _思考履歴 = 思考履歴([思考状態.初期思考状態を生成()])
        # 結果:思考状態|方針 = await _思考グラフ部署.ランダム思考(_v状況履歴, _思考履歴)
        # ExtendFunc.ExtendPrint(結果.model_dump())

        # while True:
        #     nyuryoku = input("入力 : ")
        #     _v状況履歴.新状況更新(状況リスト([状況(時間=TimeExtend(),内容=nyuryoku)]))
        #     結果:思考状態|方針 = await _思考グラフ部署.ランダム思考(_v状況履歴, _思考履歴)
        #     ExtendFunc.ExtendPrint(結果.model_dump())
