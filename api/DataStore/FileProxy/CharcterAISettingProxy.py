import json
from pyparsing import C
import yaml
from api.LLM.キャラクター内面モデル.CharacterAISetting import CharacterAISettingList
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class CharcterAISettingProxy:
    @staticmethod
    def path():
        return DataDir._().CharcterAISetting / "CharcterAISetting.yml"
    @staticmethod
    def loadCharcterAISettingYaml()->CharacterAISettingList:
        path = CharcterAISettingProxy.path()
        with open(path,encoding="UTF8") as f:
            content = f.read()
        try:
            parsedData = yaml.safe_load(content)
            if parsedData is None:
                CharacterAISettingCollection = CharacterAISettingList(list = [])
            else:
                CharacterAISettingCollection:CharacterAISettingList = CharacterAISettingList(**parsedData)
        except yaml.YAMLError as e:
            ExtendFunc.ExtendPrint("yaml読み込みエラー",e)
            CharacterAISettingCollection = CharacterAISettingList(list = [])
        return CharacterAISettingCollection
    
    @staticmethod
    def updateCharcterAISettingYaml(setting_value:CharacterAISettingList):
        path = CharcterAISettingProxy.path()
        with open(path, 'w', encoding="utf-8") as f:
            t = setting_value.model_dump_json()
            jsonToDict = json.loads(t)
            yaml.dump(jsonToDict, f, allow_unicode=True, sort_keys=False)

    @staticmethod
    def updateCharcterAISettingJson(setting_value:CharacterAISettingList):
        path = CharcterAISettingProxy.path()
        with open(path, 'w', encoding="utf-8") as f:
            t = setting_value.model_dump()
            json.dump(setting_value.model_dump(), f, indent=4, ensure_ascii=False)