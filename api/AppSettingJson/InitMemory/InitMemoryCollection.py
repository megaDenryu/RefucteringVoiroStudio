from typing import Callable
from api.AppSettingJson.InitMemory.InitMemory import D_InitMemory, InitMemoryCollectionUnit
from api.DataStore.JsonAccessor import JsonAccessor
from api.gptAI.HumanBaseModel import 利益ベクトル, 目標と利益ベクトル
from api.gptAI.HumanInfoValueObject import CharacterName, ICharacterName


class InitMemoryCollection:
    _instance: "InitMemoryCollection|None" = None

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    @classmethod
    def singleton(cls,dataLoadFunc:Callable[[],list[InitMemoryCollectionUnit]]|None = None)->"InitMemoryCollection":
        if cls._instance is None:
            cls._instance = InitMemoryCollection(dataLoadFunc)
        else:
            if dataLoadFunc is not None:
                raise ValueError("singletonは初期化後にdataLoadFuncを指定できません。")    
        return cls._instance

    _initMemoryCollection: list[InitMemoryCollectionUnit]
    _dirty: bool = False

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    def __init__(self, dataLoadFunc:Callable[[],list[InitMemoryCollectionUnit]]|None = None) -> None:
        if dataLoadFunc is not None:
            self._initMemoryCollection = dataLoadFunc()
        else:
            self._initMemoryCollection = JsonAccessor.loadInitMemoryYaml()

    def getInitMemory(self, key:CharacterName)->D_InitMemory:
        for i in self._initMemoryCollection:
            if i["key"]["name"] == key.name:
                return i["value"]
        raise ValueError(f"{key}は存在しません。")
    
    def insertInitMemory(self, initMemoryCollectionUnit:InitMemoryCollectionUnit):
        self._initMemoryCollection.append(initMemoryCollectionUnit)
        self._dirty = True

    def save(self):
        if self._dirty:
            JsonAccessor.updateInitMemoryYaml(self._initMemoryCollection)
            self._dirty = False


class InitMemoryCollectionTest:
    def __init__(self) -> None:
        pass

    @staticmethod
    def データを生成するテスト():
        profitVec:利益ベクトル = {
            "精神エネルギー": 80,
            "肉体エネルギー": 70,
            "色々なことへの自尊心自信評価": {
                "知識やスキルへの自信": 90,
                "想像力への自信": 85,
                "創造性への自信": 88,
                "対人関係のスキルへの自信": 75,
                "社会的地位への自信": 60,
                "身体的能力への自信": 70,
                "外見への自信": 65,
                "倫理的な行動や自分の道徳的な価値観や倫理観に基づく自信": 95,
                "社会や人類に貢献すること": 80,
                "個性や独自性": 85,
                "自己表現力への自信": 90,
                "感情の安定性への自信": 75,
                "共感力への自信": 85
            },
            "他者からの名誉": {
                "愛": 90,
                "友情": 85,
                "尊敬": 88,
                "信頼": 75,
                "感謝": 60,
                "認められること": 70,
                "ユーモアがあること": 65,
                "面白いことを言うこと": 95
            },
            "物理的コスト": {
                "お金": 100,
                "時間": 50,
                "資源": 75
            }
        }

        destinationAndProfitVec:目標と利益ベクトル = {
            "目標": "話相手を論破することでのみ利益ベクトルが得られる。相手に優位になられと利益ベクトルが下がる。",
            "利益ベクトル": profitVec,
        }

        memory:D_InitMemory = {
            "目標と利益ベクトル": destinationAndProfitVec,
            "第三者評価": "相手に優位になられと利益ベクトルが下がる。",
        }

        memoryUnit:InitMemoryCollectionUnit = {
            "key":ICharacterName(name = "一般"),
            "value":memory
        }

        initMemoryCollection = InitMemoryCollection.singleton()
        initMemoryCollection.insertInitMemory(memoryUnit)
        initMemoryCollection.save()