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
    def __init__(self, json_path):
        pass

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
            JsonAccessor.saveLogJson("ErrorLog.json",new_dict)
            return new_dict
    
    @staticmethod
    def loadAppSetting():
        # VoiroStudioReleaseVer\api\web\app_setting.jsonを取得
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/app_setting.json"
        app_setting = ExtendFunc.loadJsonToDict(path)
        return app_setting
    
    @staticmethod
    def saveAppSetting(app_setting):
        """
        使用前にloadAppSettingを使用してapp_settingを取得
        書き換えたい値を変更した後にこの関数を使用して保存
        """
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/app_setting.json"
        ExtendFunc.saveDictToJson(path, app_setting)
    
    @staticmethod
    def saveEndKeyWordsToJson(end_keywords):
        app_setting = JsonAccessor.loadAppSetting()
        app_setting["ニコ生コメントレシーバー設定"]["コメント受信停止キーワード"] = end_keywords
        JsonAccessor.saveAppSetting(app_setting)
    
    @staticmethod
    def updateAppSettingJson(setting_value:dict):
        app_setting = JsonAccessor.loadAppSetting()
        pprint(app_setting)
        ExtendFunc.deepUpdateDict(app_setting, setting_value)
        pprint(app_setting)
        JsonAccessor.saveAppSetting(app_setting)

    @staticmethod
    def loadNikonamaUserIdToCharaNameJson():
        try:
            path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/user_data.json"
            user_data = ExtendFunc.loadJsonToDict(path)
        except FileNotFoundError:
            user_data = {}
        return user_data
    

    @staticmethod
    def ApiKeyFileGenerate():
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/openai_api_key.json"
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            with open(path, mode='w') as f:
                json.dump({
                    "openai_api_key":"",
                    "twitch_access_token":"",
                    "gemini_api_key":""
                }, f, indent=4)

    @staticmethod
    def loadOpenAIAPIKey()->str|None:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/openai_api_key.json"
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            JsonAccessor.ApiKeyFileGenerate()
            return None
        try:
            openai_api_key = ExtendFunc.loadJsonToDict(path)["openai_api_key"]
            return openai_api_key
        except KeyError:
            return None
    
    @staticmethod
    def loadTwitchAccessToken()->str|None:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/openai_api_key.json"
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            JsonAccessor.ApiKeyFileGenerate()
            return None
        try:
            twitch_access_token = ExtendFunc.loadJsonToDict(path)["twitch_access_token"]
            return twitch_access_token
        except KeyError:
            return None
    
    @staticmethod
    def loadGeminiAPIKey()->str|None:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/openai_api_key.json"
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            JsonAccessor.ApiKeyFileGenerate()
            return None
        try:
            gemini_api_key = ExtendFunc.loadJsonToDict(path)["gemini_api_key"]
            return gemini_api_key
        except KeyError:
            return None
    
    BaseModelList = TypeVar("BaseModelList", bound=BaseModelList)
    BaseModelT = TypeVar("BaseModelT", bound=BaseModel)
    @staticmethod
    def loadYamlToBaseModel(yaml_path:Path, baseModel:Type[BaseModelList])->BaseModelList:
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
    def loadCharcterDestinationYaml()->CharacterDestinationList:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharacterDestination/CharacterDestination.yml"
        return JsonAccessor.loadYamlToBaseModel(path, CharacterDestinationList)
    
    @staticmethod
    def updateCharcterDestinationYaml(setting_value:CharacterDestinationList):
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharacterDestination/CharacterDestination.yml"
        JsonAccessor.updateYamlFromBaseModel(path, setting_value)

    @staticmethod
    def loadOldCharcterAISettingYamlAsString()->str:
        """
        CharSetting.ymlを読み込み、その内容を文字列として返します。
        """
        yml_path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharcterAISetting/OldCharcterAISetting.yml"
        with open(yml_path,encoding="UTF8") as f:
                content = f.read()
        return content
    
    @staticmethod
    def loadCharcterAISettingYaml()->CharacterAISettingList:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharcterAISetting/CharcterAISetting.yml"
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
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharcterAISetting/CharcterAISetting.yml"
        with open(path, 'w', encoding="utf-8") as f:
            t = setting_value.model_dump_json()
            jsonToDict = json.loads(t)
            yaml.dump(jsonToDict, f, allow_unicode=True, sort_keys=False)

    @staticmethod
    def updateCharcterAISettingJson(setting_value:CharacterAISettingList):
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/CharcterAISetting/CharcterAISetting.json"
        with open(path, 'w', encoding="utf-8") as f:
            t = setting_value.model_dump()
            pprint(t)
            json.dump(setting_value.model_dump(), f, indent=4, ensure_ascii=False)
    
    @staticmethod
    def loadAppSettingYamlAsString(yml_file_name:str)->str:
        """
        CharSetting.ymlを読み込み、その内容を文字列として返します。
        """
        yml_path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson" / yml_file_name
        with open(yml_path,encoding="UTF8") as f:
                content = f.read()
        return content
    
    @staticmethod
    def loadAppSettingYamlAsReplacedDict(yml_file_name:str, replace_dict:dict)->dict:
        """
        CharSetting.ymlを読み込み、その内容を辞書として返します。
        """
        content = JsonAccessor.loadAppSettingYamlAsString(yml_file_name)
        replaced_content = ExtendFunc.replaceBulkString(content, replace_dict)
        content_dict = yaml.safe_load(replaced_content)
        return content_dict
    
    @staticmethod
    def loadGptBehaviorYaml(chara_name:str = "一般")->GPTBehaviorDict:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/GPTBehavior/GPTBehavior.yml"
        with open(path,encoding="UTF8") as f:
            content = f.read()
        dic:dict[GPTBehaviorKey,GPTBehaviorDict] = yaml.safe_load(content)
        return dic[chara_name]
    
    @staticmethod
    def loadCoeiroinkNameToNumberJson():
        path = DataDir._().CharSettingJson / "CoeiroinkNameToNumber.json"
        coeiroink_name_to_number = ExtendFunc.loadJsonToDict(path)
        return coeiroink_name_to_number
    
    @staticmethod
    def saveCoeiroinkNameToNumberJson(coeiroink_name_to_number):
        path = DataDir._().CharSettingJson / "CoeiroinkNameToNumber.json"
        ExtendFunc.saveDictToJson(path, coeiroink_name_to_number)

    @staticmethod
    def loadGPTBehaviorYaml(chara_name:str = "一般"):
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/GPTBehavior.yml"
        with open(path,encoding="UTF8") as f:
            content = f.read()
        dict = yaml.safe_load(content)
        return dict[chara_name]
    
    @staticmethod
    def saveLogJson(file_name, input_dict):
        # 拡張子がついてるかチェックし、なければつける
        if not file_name.endswith(".json"):
            file_name += ".json"
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "LogJson" / file_name
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
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "LogJson" / file_name
        dict = ExtendFunc.loadJsonToDict(path)
        dict.update(save_dict)
        # ExtendFunc.ExtendPrint("dict",dict)
        ExtendFunc.saveDictToJson(path, dict)

    @staticmethod
    def loadInitMemoryYaml()->list[InitMemoryCollectionUnit]:
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/InitMemory/InitMemory.yml"
        with open(path,encoding="UTF8") as f:
            content = f.read()
        initMemoryCollectionlist:list[InitMemoryCollectionUnit] = yaml.safe_load(content)
        return initMemoryCollectionlist
    
    @staticmethod
    def updateInitMemoryYaml(collectionList:list[InitMemoryCollectionUnit]):
        path = ExtendFunc.getTargetDirFromParents(__file__, "api") / "AppSettingJson/InitMemory/InitMemory.yml"
        with open(path, 'w', encoding="utf-8") as f:
            yaml.dump(collectionList, f, allow_unicode=True)
    
    @staticmethod
    def loadHasSaveData(charaName:CharacterName):
        return False

    
class JsonAccessorTest:
    def __init__(self) -> None:
        pudate = {}
        pudate["ニコ生コメントレシーバー設定"] = {}
        pudate["ニコ生コメントレシーバー設定"]["生放送URL"] = "test"
        JsonAccessor.updateAppSettingJson(pudate)