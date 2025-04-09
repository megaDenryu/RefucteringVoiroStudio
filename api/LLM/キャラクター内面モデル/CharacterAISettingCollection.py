from pprint import pprint
from typing import Callable
from api.LLM.キャラクター内面モデル.CharacterAISetting import ActionPattern, CharacterAISetting, CharacterAISettingCollectionUnit, CharacterAISettingList, CharacterRelationships, Emotion
from api.DataStore.FileProxy.CharcterAISettingProxy import CharcterAISettingProxy
from api.DataStore.JsonAccessor import JsonAccessor
from api.gptAI.HumanInfoValueObject import CharacterName


class CharacterAISettingCollection:
    _instance: "CharacterAISettingCollection|None" = None
    _characterAISettingCollection:CharacterAISettingList = CharacterAISettingList(list = [])
    _dirty: bool = False

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    @classmethod
    def singleton(cls,dataLoadFunc:Callable[[],CharacterAISettingList]|None = None)->"CharacterAISettingCollection":
        if cls._instance is None:
            cls._instance = CharacterAISettingCollection(dataLoadFunc)
        else:
            if dataLoadFunc is not None:
                raise ValueError("singletonは初期化後にdataLoadFuncを指定できません。")    
        return cls._instance

    

    """
    @parm dataLoadFunc: テストなどで他のデータをロードしたいときにロードする関数を指定します。指定しない場合はJsonAccessor.loadInitMemoryYamlを使用します。
    """
    def __init__(self, dataLoadFunc:Callable[[],CharacterAISettingList]|None = None) -> None:
        if dataLoadFunc is not None:
            self._characterAISettingCollection = dataLoadFunc()
        else:
            self._characterAISettingCollection = CharcterAISettingProxy.loadCharcterAISettingYaml()

    def getCharacterAISetting(self, characterName:CharacterName)->CharacterAISetting:
        for unit in self._characterAISettingCollection.list:
            if unit.key.name == characterName.name:
                return unit.value
        raise ValueError(f"{characterName}の設定データは存在しません。")
    
    def insertCharacterAISetting(self, characterAISettingCollectionUnit:CharacterAISettingCollectionUnit):
        self._characterAISettingCollection.list.append(characterAISettingCollectionUnit)
        self._dirty = True

    def save(self):
        if self._dirty:
            CharcterAISettingProxy.updateCharcterAISettingYaml(self._characterAISettingCollection)
            self._dirty = False
    def saveJson(self):
        if self._dirty:
            CharcterAISettingProxy.updateCharcterAISettingJson(self._characterAISettingCollection)
            self._dirty = False

    @staticmethod
    def InputProcess(unit: CharacterAISettingCollectionUnit):
        collection = CharacterAISettingCollection.singleton()
        pprint(collection._characterAISettingCollection.dict())
        collection.insertCharacterAISetting(unit)
        collection.save()
        # collection.saveJson()



class CharacterAISettingCollectionTest:
    def __init__(self) -> None:
        pass

    @staticmethod
    def キャラAI設定を生成するてすと():
        # 成功
        # キャラクターの関係を定義
        relationship1 = CharacterRelationships(他のキャラクター名="John Doe", 関係="友人")
        relationship2 = CharacterRelationships(他のキャラクター名="Jane Smith", 関係="敵対者")

        # 行動パターンを定義
        action_pattern1 = ActionPattern(感情=Emotion.喜び, 行動="笑う")
        action_pattern2 = ActionPattern(感情=Emotion.怒り, 行動="叫ぶ")

        # キャラクターの設定を定義
        character_setting = CharacterAISetting(
            名前="ずんだもん",
            年齢=7,
            性別="女性",
            背景情報="小さな村で育った。",
            役割="探偵",
            動機="真実を見つけるため",
            アリバイ="事件当時は図書館にいた",
            性格特性="冷静で分析的",
            関係=[relationship1, relationship2],
            秘密="実は過去に犯罪歴がある",
            知っている情報="事件の詳細を知っている",
            外見の特徴="えだまめ",
            所持品=["ノート", "ペン", "懐中電灯"],
            行動パターン=[action_pattern1, action_pattern2]
        )
    
        unit = CharacterAISettingCollectionUnit(
            key=CharacterName(name="ゆかり"),
            value=character_setting
        )
        CharacterAISettingCollection.InputProcess(unit)