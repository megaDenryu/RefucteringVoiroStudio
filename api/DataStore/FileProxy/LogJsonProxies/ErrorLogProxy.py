import json
from os import path

from api.DataStore.FileProxy.LogJsonProxies.LogJsonProxy import LogJsonProxy
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend


class ErrorLogProxy:
    @staticmethod
    def extendJsonLoad(loadString:str):
        """
        json文字列を読み込み、辞書型に変換します。できない場合は何かしらのjsonにして返します
        """
        try:
            return json.loads(loadString)
        except json.JSONDecodeError:
            new_dict = {f"{TimeExtend()}":loadString, "エラー":"json形式でないため、文章のみを返します。"}
            ExtendFunc.ExtendPrint("new_dict",new_dict)
            LogJsonProxy.saveLogJson("ErrorLog.json",new_dict)
            return new_dict