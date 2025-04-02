import json
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend


class LogJsonProxy:
    @staticmethod
    def saveLogJson(file_name, input_dict):
        # 拡張子がついてるかチェックし、なければつける
        if not file_name.endswith(".json"):
            file_name += ".json"
        path = DataDir._().LogJson / file_name
        ExtendFunc.saveDictToJson(path, input_dict)

    @staticmethod
    def insertLogJsonToDict(file_name, input_dict, data_name:str = ""):
        if  isinstance(input_dict, str):
            try:
                input_dict = json.loads(input_dict)
            except json.JSONDecodeError:
                input_dict = {"文章":input_dict, "エラー":"json形式でないため、文章のみ保存しました。"}
        
        now_time = TimeExtend()
        save_dict = {
            f"{now_time.date} : {data_name}":input_dict
        }
        # ExtendFunc.ExtendPrint("save_dict",save_dict)
        # 拡張子がついてるかチェックし、なければつける
        if not file_name.endswith(".json"):
            file_name += ".json"
        path = DataDir._().LogJson / file_name
        dict = ExtendFunc.loadJsonToDict(path)
        dict.update(save_dict)
        # ExtendFunc.ExtendPrint("dict",dict)
        ExtendFunc.saveDictToJson(path, dict)