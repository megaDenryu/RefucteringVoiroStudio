from api.Extend.BaseModel.model_dumpable import IModelDumpAble


class 保存済み記憶課(IModelDumpAble):
    data : list[dict|list]
    def __init__(self, data: list[dict|list]) -> None:
        self.data = data
    def model_dump(self)->list[dict|list]:
        """
        思考状態をprimitiveに変換する
        """
        return self.data
    @classmethod
    def modelLoad(cls) -> "保存済み記憶課":
        """
        思考状態をprimitiveから復元する
        """
        data = []
        return cls(data)