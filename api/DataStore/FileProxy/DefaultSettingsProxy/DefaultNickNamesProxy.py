from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class DefaultNickNamesProxy:
    @staticmethod
    def path():
        return DataDir._().DefaultSettings / "DefaultNickNames.json"
    
    @staticmethod
    def load():
        path = DefaultNickNamesProxy.path()
        JsonAccessor.checkExistAndCreateJson(path, {})
        return ExtendFunc.loadJsonToDict(path)