from api.Extend.BaseModel.model_dumpable import IModelDumpAble


class 未保存記憶課(IModelDumpAble):
    _data : list[IModelDumpAble]
    def __init__(self) -> None:
        self._data = []
    def model_dump(self)->list[dict|list]:
        """
        思考状態をprimitiveに変換する
        """
        ret_data = [思考状態.model_dump() for 思考状態 in self._data]
        return ret_data
    def 追加(self, 思考状態: IModelDumpAble):
        self._data.append(思考状態)