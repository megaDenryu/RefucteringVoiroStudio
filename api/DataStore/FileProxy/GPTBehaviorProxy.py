import yaml
from api.AppSettingJson.GPTBehavior.GPTBehavior import GPTBehaviorDict, GPTBehaviorKey
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class GPTBehaviorProxy:
    @staticmethod
    def path():
        return DataDir._().GPTBehavior / "GPTBehavior.yml"
    @staticmethod
    def loadGptBehaviorYaml(chara_name:str = "一般")->GPTBehaviorDict:
        path = GPTBehaviorProxy.path()
        with open(path,encoding="UTF8") as f:
            content = f.read()
        dic:dict[GPTBehaviorKey,GPTBehaviorDict] = yaml.safe_load(content)
        return dic[chara_name]
    
    @staticmethod
    def loadGPTBehaviorYaml(chara_name:str = "一般"):
        path = GPTBehaviorProxy.path()
        with open(path,encoding="UTF8") as f:
            content = f.read()
        dict = yaml.safe_load(content)
        return dict[chara_name]