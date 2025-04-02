import yaml
from api.AppSettingJson.InitMemory.InitMemory import InitMemoryCollectionUnit
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class InitMemoryProxy:
    @staticmethod
    def path():
        return DataDir._().InitMemory / "InitMemory.yml"
    @staticmethod
    def loadInitMemoryYaml()->list[InitMemoryCollectionUnit]:
        path = InitMemoryProxy.path()
        with open(path,encoding="UTF8") as f:
            content = f.read()
        initMemoryCollectionlist:list[InitMemoryCollectionUnit] = yaml.safe_load(content)
        return initMemoryCollectionlist
    
    @staticmethod
    def updateInitMemoryYaml(collectionList:list[InitMemoryCollectionUnit]):
        path = InitMemoryProxy.path()
        with open(path, 'w', encoding="utf-8") as f:
            yaml.dump(collectionList, f, allow_unicode=True)