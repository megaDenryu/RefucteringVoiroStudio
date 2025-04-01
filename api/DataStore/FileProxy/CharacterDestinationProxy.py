from api.AppSettingJson.CharacterDestination.CharacterDestination import CharacterDestinationList
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class CharacterDestinationProxy:
    @staticmethod
    def loadCharcterDestinationYaml()->CharacterDestinationList:
        path = DataDir._().CharacterDestination / "CharacterDestination.yml"
        return JsonAccessor.loadYamlToBaseModel(path, CharacterDestinationList)
    
    @staticmethod
    def updateCharcterDestinationYaml(setting_value:CharacterDestinationList):
        path = DataDir._().CharacterDestination / "CharacterDestination.yml"
        JsonAccessor.updateYamlFromBaseModel(path, setting_value)