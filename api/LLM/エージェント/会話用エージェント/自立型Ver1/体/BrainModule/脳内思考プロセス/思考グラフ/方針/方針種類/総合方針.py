from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.中期方針 import 中期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.短期方針 import 短期方針
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考グラフ.方針.方針種類.長期方針 import 長期方針


class 総合方針:
    def __init__(self,
                 v短期方針:短期方針,
                 v中期方針:中期方針,
                 v長期方針:長期方針
                 ) -> None:
        self.短期方針 = v短期方針
        self.中期方針 = v中期方針
        self.長期方針 = v長期方針

    def model_dump(self)->dict:
        """
        方針をprimitiveに変換する
        """
        ret_dict = {
            "短期方針": self.短期方針.model_dump(),
            "中期方針": self.中期方針.model_dump(),
            "長期方針": self.長期方針.model_dump()
        }
        return ret_dict
        