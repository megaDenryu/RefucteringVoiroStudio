from api.AppSettingJson.CharacterDestination.CharacterDestination import CharacterDestinationList
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class CharacterDestinationProxy:
    @staticmethod
    def path():
        return DataDir._().CharacterDestination / "CharacterDestination.yml"
    @staticmethod
    def loadCharcterDestinationYaml()->CharacterDestinationList:
        path = CharacterDestinationProxy.path()
        return JsonAccessor.loadYamlToBaseModelList(path, CharacterDestinationList)
    
    @staticmethod
    def updateCharcterDestinationYaml(setting_value:CharacterDestinationList):
        path = CharacterDestinationProxy.path()
        JsonAccessor.updateYamlFromBaseModel(path, setting_value)