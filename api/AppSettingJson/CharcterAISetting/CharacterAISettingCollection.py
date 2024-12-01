from typing import Callable
from api.AppSettingJson.CharcterAISetting.CharacterAISetting import CharacterAISettingCollectionUnit
from api.DataStore.JsonAccessor import JsonAccessor
from api.gptAI.HumanInfoValueObject import CharacterName


class CharacterAISettingCollection:
    _instance: "CharacterAISettingCollection|None" = None

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    @classmethod
    def singleton(cls,dataLoadFunc:Callable[[],list[CharacterAISettingCollectionUnit]]|None = None)->"CharacterAISettingCollection":
        if cls._instance is None:
            cls._instance = CharacterAISettingCollection(dataLoadFunc)
        else:
            if dataLoadFunc is not None:
                raise ValueError("singletonは初期化後にdataLoadFuncを指定できません。")    
        return cls._instance

    _characterAISettingCollection: list[CharacterAISettingCollectionUnit]
    _dirty: bool = False

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    def __init__(self, dataLoadFunc:Callable[[],list[CharacterAISettingCollectionUnit]]|None = None) -> None:
        if dataLoadFunc is not None:
            self._characterAISettingCollection = dataLoadFunc()
        else:
            self._characterAISettingCollection = JsonAccessor.loadCharcterAISettingYaml()

    def getCharacterAISetting(self, characterName:CharacterName)->CharacterAISettingCollectionUnit|None:
        for unit in self._characterAISettingCollection:
            if unit["key"]["name"] == characterName.name:
                return unit
        return None
    
    def insertCharacterAISetting(self, characterAISettingCollectionUnit:CharacterAISettingCollectionUnit):
        self._characterAISettingCollection.append(characterAISettingCollectionUnit)
        self._dirty = True

    def save(self):
        if self._dirty:
            JsonAccessor.updateCharcterAISettingYaml(self._characterAISettingCollection)
            self._dirty = False


class CharacterAISettingCollectionTest:
    def __init__(self) -> None:
        pass

    @staticmethod
    def キャラAI設定を生成するてすと():
    
        unit:CharacterAISettingCollectionUnit = {
            "key": {
                "name": "テストキャラ"
            },
            "value": {
            }
        }
        collection = CharacterAISettingCollection.singleton()
        collection.insertCharacterAISetting(unit)
        collection.save()