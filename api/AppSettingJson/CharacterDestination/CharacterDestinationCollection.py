from pprint import pprint
from typing import Callable
from api.AppSettingJson.CharacterDestination.CharacterDestination import (
    CharacterDestination,
    CharacterDestinationCollectionUnit,
    CharacterDestinationList,
)
from api.DataStore.FileProxy.CharacterDestinationProxy import CharacterDestinationProxy
from api.DataStore.JsonAccessor import JsonAccessor
from api.gptAI.HumanInfoValueObject import CharacterName


class CharacterDestinationCollection:
    _instance: "CharacterDestinationCollection|None" = None
    _characterDestinationCollection: CharacterDestinationList = CharacterDestinationList(list=[])
    _dirty: bool = False

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadCharcterDestinationYamlを使用します。
    """
    @classmethod
    def singleton(cls, dataLoadFunc: Callable[[], CharacterDestinationList] | None = None) -> "CharacterDestinationCollection":
        if cls._instance is None:
            cls._instance = CharacterDestinationCollection(dataLoadFunc)
        else:
            if dataLoadFunc is not None:
                raise ValueError("singletonは初期化後にdataLoadFuncを指定できません。")
        return cls._instance

    def __init__(self, dataLoadFunc: Callable[[], CharacterDestinationList] | None = None) -> None:
        if dataLoadFunc is not None:
            self._characterDestinationCollection = dataLoadFunc()
        else:
            self._characterDestinationCollection = CharacterDestinationProxy.loadCharcterDestinationYaml()

    def getCharacterDestination(self, characterName: CharacterName) -> CharacterDestination:
        for unit in self._characterDestinationCollection.list:
            if unit.key.name == characterName.name:
                return unit.value
        raise ValueError(f"{characterName}の目的地データは存在しません。")

    def insertCharacterDestination(self, characterDestinationCollectionUnit: CharacterDestinationCollectionUnit):
        self._characterDestinationCollection.list.append(characterDestinationCollectionUnit)
        self._dirty = True

    def save(self):
        if self._dirty:
            CharacterDestinationProxy.updateCharcterDestinationYaml(self._characterDestinationCollection)
            self._dirty = False

    @staticmethod
    def InputProcess(unit: CharacterDestinationCollectionUnit):
        collection = CharacterDestinationCollection.singleton()
        pprint(collection._characterDestinationCollection.dict())
        collection.insertCharacterDestination(unit)
        collection.save()
        # collection.saveJson()


class CharacterDestinationCollectionTest:
    def __init__(self) -> None:
        pass

    @staticmethod
    def 目的設定を生成するてすと():
        # 成功
        # キャラクターの目的地を定義

        # キャラクターの目的地設定を定義
        character_destination = CharacterDestination(
            キャラ名="ずんだもん",
            短期目標="キャラクターが動いて欲しい",
            中期目標="タスクを終わらせる",
            長期目標="会社を粉砕する"
        )

        unit = CharacterDestinationCollectionUnit(
            key=CharacterName(name="ゆかり"),
            value=character_destination
        )
        CharacterDestinationCollection.InputProcess(unit)

