from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針object import 方針


class 方針履歴:
    方針リスト: list[方針]
    def __init__(self,方針リスト: list[方針]) -> None:
        self.方針リスト = 方針リスト
    def 追加(self,方針:方針) -> None:
        self.方針リスト.append(方針)
    @property
    def 最新の方針(self)->方針:
        return self.方針リスト[-1]
    def model_dump(self):
        primitive方針リスト:list[dict[str,str]] = []
        for 方針 in self.方針リスト:
            primitive方針リスト.append(方針.model_dump())
        return primitive方針リスト