from enum import Enum
from pprint import pprint
import sys
from pathlib import Path
from typing import Type, TypeVar

from pydantic import BaseModel
from api.AppSettingJson.CharacterDestination.CharacterDestination import CharacterDestinationList
from api.AppSettingJson.CharcterAISetting.CharacterAISetting import CharacterAISettingCollectionUnit, CharacterAISettingList
from api.AppSettingJson.GPTBehavior.GPTBehavior import GPTBehaviorDict,GPTBehaviorKey
from api.AppSettingJson.InitMemory.InitMemory import D_InitMemory, InitMemoryCollectionUnit
from api.DataStore.data_dir import DataDir
from api.Extend.BaseModel.BaseModelList import BaseModelList
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
import json
import yaml

from api.gptAI.HumanInfoValueObject import CharacterName

class JsonAccessor:

    @staticmethod
    def dictToJsonString(input_dict:dict)->str:
        return json.dumps(input_dict, indent=4, ensure_ascii=False)
    
    @staticmethod
    def checkExistAndCreateJson(path:Path, saveobj:dict|list|None):
        try: 
            # ディレクトリが存在しない場合は作成
            if not path.parent.exists():
                path.parent.mkdir(parents=True, exist_ok=True)

            # ファイルが存在しない場合は作成して内容を書き込む
            if not path.exists() and saveobj is not None:
                with open(path, mode='w') as f:
                    json.dump(saveobj, f, indent=4)
        except Exception as e:
            ExtendFunc.ExtendPrint({
                "エラー":"Jsonファイルの作成に失敗しました。",
                "エラー内容":str(e),
                "path":f"{path}",
                "saveobj":saveobj
            })

    
    
    
    BaseModelList = TypeVar("BaseModelList", bound=BaseModelList)
    BaseModelT = TypeVar("BaseModelT", bound=BaseModel)
    @staticmethod
    def loadYamlToBaseModelList(yaml_path:Path, baseModel:Type[BaseModelList])->BaseModelList:
        with open(yaml_path,encoding="UTF8") as f:
            content = f.read()
        try:
            parsedData = yaml.safe_load(content)
            if parsedData is None:
                return baseModel(list = [])
            else:
                return baseModel(**parsedData)
        except yaml.YAMLError as e:
            ExtendFunc.ExtendPrint("yaml読み込みエラー",e)
            return baseModel(list = [])
        
    @staticmethod
    def loadYamlToBaseModel(yaml_path:Path, baseModel:Type[BaseModelT])->BaseModelT|None:
        with open(yaml_path,encoding="UTF8") as f:
            content = f.read()
        try:
            parsedData = yaml.safe_load(content)
            if parsedData is None:
                return baseModel()
            else:
                return baseModel(**parsedData)
        except yaml.YAMLError as e:
            ExtendFunc.ExtendPrint("yaml読み込みエラー",e)
            return None
        
    @staticmethod
    def updateYamlFromBaseModel(yaml_path:Path, baseModel:BaseModel):
        """
        Enumを含むBaseModelをyamlに書き込めます。
        """
        with open(yaml_path, 'w', encoding="utf-8") as f:
            t = baseModel.model_dump_json()
            jsonToDict = json.loads(t)
            yaml.dump(jsonToDict, f, allow_unicode=True, sort_keys=False)

    @staticmethod
    def loadJsonToBaseModel(json_path:Path, baseModel:Type[BaseModelT])->BaseModelT|None:
        with open(json_path,encoding="UTF8") as f:
            content = f.read()
        try:
            parsedData = json.loads(content)
            return baseModel(**parsedData)
        except json.JSONDecodeError as e:
            ExtendFunc.ExtendPrint("json読み込みエラー",e)
            return None
    
    @staticmethod
    def updateJsonFromBaseModel(json_path:Path, baseModel:BaseModel):
        with open(json_path, 'w', encoding="utf-8") as f:
            json.dump(baseModel.model_dump(), f, indent=4, ensure_ascii=False)
    
    @staticmethod
    def loadHasSaveData(charaName:CharacterName):
        return False

    
