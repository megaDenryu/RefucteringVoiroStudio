from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.思考グラフ部署 import 思考グラフ部署
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.創造的連想モジュール import 創造的連想モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.統合思考モデル.連鎖的思考モデル import モデル連鎖思考
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
    
    @classmethod
    async def test自問自答もじゅーる(cls):
        _v自分の情報 = 自分の情報コンテナ(id="結月ゆかり")
        _v思考履歴 = 思考履歴([思考状態.初期思考状態を生成()])
        _v状況履歴:状況履歴 = 状況履歴(
            前状況 = 状況リスト([状況(時間=TimeExtend(),内容="それじゃあ自己紹介します。",)]),
            新状況 = 状況リスト([状況(時間=TimeExtend(),内容=_v自分の情報.load作られたばかりのAI(),)]),
        )
        v自問自答モジュール = 自問自答モジュール()
        kekka = await v自問自答モジュール.実行(_v状況履歴, _v思考履歴, _v自分の情報)
        ExtendFunc.ExtendPrint(kekka.model_dump())

    @classmethod
    async def test創造的連想モデル(cls):
        _v自分の情報 = 自分の情報コンテナ(id="結月ゆかり")
        _v思考履歴 = 思考履歴([思考状態.初期思考状態を生成()])
        _v状況履歴:状況履歴 = 状況履歴(
            前状況 = 状況リスト([状況(時間=TimeExtend(),内容="それじゃあ自己紹介します。",)]),
            新状況 = 状況リスト([状況(時間=TimeExtend(),内容=_v自分の情報.load作られたばかりのAI(),)]),
        )
        v創造的連想モジュール = 創造的連想モジュール()
        kekka = await v創造的連想モジュール.実行(_v状況履歴, _v思考履歴, _v自分の情報)
        ExtendFunc.ExtendPrint(kekka.model_dump())

    @classmethod
    async def testモデル連鎖思考(cls):
        _v自分の情報 = 自分の情報コンテナ(id="結月ゆかり")
        _v思考履歴 = 思考履歴([思考状態.初期思考状態を生成()])
        _v状況履歴:状況履歴 = 状況履歴(
            前状況 = 状況リスト([状況(時間=TimeExtend(),内容="それじゃあ自己紹介します。",)]),
            新状況 = 状況リスト([状況(時間=TimeExtend(),内容=_v自分の情報.load作られたばかりのAI(),)]),
        )
        vモデル連鎖思考 = モデル連鎖思考()
        kekka = await vモデル連鎖思考.実行(_v状況履歴, _v思考履歴, _v自分の情報)
        ExtendFunc.ExtendPrint(kekka.model_dump())