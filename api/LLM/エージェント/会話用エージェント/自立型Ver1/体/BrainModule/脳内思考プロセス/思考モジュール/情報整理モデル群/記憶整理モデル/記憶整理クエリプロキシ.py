from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.LLMAPIBase.LLMInterface.QueryProxy import QueryProxy, クエリ段落


class 記憶整理クエリプロキシ(QueryProxy):
    """
    記憶整理クエリプロキシ
    """
    def __init__(self, 記憶リスト:list[IModelDumpAble]) -> None:
        for index in range(len(記憶リスト)):
            self._クエリプロキシ.append(クエリ段落(f"記憶{index}", 記憶リスト[index]))
        self._クエリプロキシ.append(クエリ段落("指示", self.指示文))
        self._クエリプロキシ 

    @property
    def 指示文(self) -> str:
        return """
あなたは記憶整理の専門家です。
あなたの役割は、与えられた情報を整理し、指定された構造化出力の項目を抽出することです。
"""