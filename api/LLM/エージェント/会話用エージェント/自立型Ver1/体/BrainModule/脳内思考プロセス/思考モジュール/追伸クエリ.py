from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落


class 追伸クエリ(QueryProxy):
    """
    追伸クエリプロキシ
    """
    def __init__(self, 追伸情報: list[IModelDumpAble|str]) -> None:
        for index in range(len(追伸情報)):
            self._クエリプロキシ.append(クエリ段落(f"追伸情報{index}", 追伸情報[index]))

    def model_dump(self):
        return self.dict化クエリ


    