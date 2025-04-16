from api.Extend.BaseModel.model_dumpable import IModelDumpAble
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.情報整理モデル群.記憶整理モデル.出力BaseModel import OrganizingMemoryResult
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.情報整理モデル群.記憶整理モデル.記憶整理モデル import 記憶整理モデル


class 記憶整理課(IModelDumpAble):
    """
    記憶を整理して、整理済みの記憶を管理する課
    """
    v記憶整理モデル: 記憶整理モデル
    整理済み記憶 : OrganizingMemoryResult
    def __init__(self) -> None:
        self._data = []
    def model_dump(self):
        """
        思考状態をprimitiveに変換する
        """
        return self.整理済み記憶.model_dump()
    async def 記憶整理(self, 記憶: list[IModelDumpAble]):
        """
        記憶を整理する
        """
        # LLMを使って記憶を整理する
        result = await self.v記憶整理モデル.情報をもとに実行(記憶)
        self.整理済み記憶 = self.整理済み記憶.報酬感情のみ上書きしてマージ(result)
    
    