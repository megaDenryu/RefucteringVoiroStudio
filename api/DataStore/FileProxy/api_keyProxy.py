import json
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class api_keyProxy:
    @staticmethod
    def path():
        return DataDir._().AppSettingJson / "api_key.json"

    @staticmethod
    def ApiKeyFileGenerate():
        path = api_keyProxy.path()
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
        path = api_keyProxy.path()
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            api_keyProxy.ApiKeyFileGenerate()
            return None
        try:
            openai_api_key = ExtendFunc.loadJsonToDict(path)["openai_api_key"]
            return openai_api_key
        except KeyError:
            return None
    
    @staticmethod
    def loadTwitchAccessToken()->str|None:
        path = api_keyProxy.path()
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            api_keyProxy.ApiKeyFileGenerate()
            return None
        try:
            twitch_access_token = ExtendFunc.loadJsonToDict(path)["twitch_access_token"]
            return twitch_access_token
        except KeyError:
            return None
    
    @staticmethod
    def loadGeminiAPIKey()->str|None:
        path = api_keyProxy.path()
        #もしファイルが存在しない場合はファイルを作成
        if not path.exists():
            api_keyProxy.ApiKeyFileGenerate()
            return None
        try:
            gemini_api_key = ExtendFunc.loadJsonToDict(path)["gemini_api_key"]
            return gemini_api_key
        except KeyError:
            return None