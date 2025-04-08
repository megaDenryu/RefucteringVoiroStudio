from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.中期方針 import 中期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.総合方針 import 総合方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.長期方針 import 長期方針


class 方針履歴:
    短期方針リスト: list[短期方針]
    中期方針リスト: list[中期方針]
    長期方針リスト: list[長期方針]
    
    def __init__(self,短期方針リスト: list[短期方針], 中期方針リスト: list[中期方針], 長期方針リスト: list[長期方針]) -> None:
        self.短期方針リスト = 短期方針リスト
        self.中期方針リスト = 中期方針リスト
        self.長期方針リスト = 長期方針リスト
    def 追加短期方針(self,方針:短期方針) -> None:
        self.短期方針リスト.append(方針)
    def 追加中期方針(self,方針:中期方針) -> None:
        self.中期方針リスト.append(方針)
    def 追加長期方針(self,方針:長期方針) -> None:
        self.長期方針リスト.append(方針)
    @property
    def 最新短期方針(self)->短期方針:
        return self.短期方針リスト[-1]
    @property
    def 最新中期方針(self)->中期方針:
        return self.中期方針リスト[-1]
    @property
    def 最新長期方針(self)->長期方針:
        return self.長期方針リスト[-1]
    @property
    def 最新総合方針(self)->総合方針:
        return 総合方針(self.最新短期方針,self.最新中期方針,self.最新長期方針)
    def model_dump(self):
        primitive方針リスト:list[dict[str,str]] = []
        for 方針 in self.短期方針リスト:
            primitive方針リスト.append(方針.model_dump())
        return primitive方針リスト