from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class CoeiroinkNameToNumberProxy:
    @staticmethod
    def path():
        return DataDir._().CharSettingJson / "CoeiroinkNameToNumber.json"
    
    @staticmethod
    def loadCoeiroinkNameToNumberJson():
        path = DataDir._().CharSettingJson / "CoeiroinkNameToNumber.json"
        coeiroink_name_to_number = ExtendFunc.loadJsonToDict(path)
        return coeiroink_name_to_number
    
    @staticmethod
    def saveCoeiroinkNameToNumberJson(coeiroink_name_to_number):
        path = DataDir._().CharSettingJson / "CoeiroinkNameToNumber.json"
        ExtendFunc.saveDictToJson(path, coeiroink_name_to_number)