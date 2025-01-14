import asyncio
from pathlib import Path
from pprint import pprint
from api.AppSettingJson.CharacterDestination.CharacterDestinationCollection import CharacterDestinationCollectionTest
from api.AppSettingJson.CharcterAISetting.CharacterAISettingCollection import CharacterAISettingCollectionTest
from api.AppSettingJson.InitMemory.InitMemory import D_InitMemory, InitMemoryCollectionUnit
from api.DataStore.AppSetting.AppSettingModel.AppSettingInitReq import AppSettingInitReq
from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.TwitchLive.TwitchSettingModel import TwitchSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.YoutubeLive.YoutubeLiveSettingModel import YoutubeLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.GPTSetting.GPTSetting import GPTSettingModel
from api.DataStore.JsonAccessor import JsonAccessor, JsonAccessorTest
from api.DataStore.Memo import Memo, MemoTest
from api.DataStore.PickleAccessor import PickleAccessor, PickleAccessorTest
from api.Extend.BaseModel.BaseModelConverter import BaseModelConverterTest
from api.Extend.BaseModel.BaseModelListMap import MapHasListValue
from api.Extend.BaseModel.ExtendBaseModel import Map, MapItem
from api.Extend.ExtendFunc import ExtendFunc, ExtendFuncTest
from api.Extend.ExtendSet import ExtendDict, Interval, ExtendSet, ExtendSetTest
from api.InstanceManager.InstanceManager import InastanceManager
from api.LibraryStudySample.BaseModel.FieldSample import Field_factoryを使ってみる
from api.ObjectConverter.ObjectConverterTest import generate_zod_schema, write_to_ts_file, テストMain
from api.gptAI.AIRubiConverter import AIRubiConverterTest
from api.gptAI.AgentManager import AgentManagerTest, GPTAgent, GPTBrain, LifeProcessBrain, 外界からの入力
from api.gptAI.HumanBaseModel import 利益ベクトル, 目標と利益ベクトル
from api.gptAI.HumanInfoValueObject import ICharacterName
from api.gptAI.HumanInformation import AllHumanInformationDict, AllHumanInformationManager, CharacterModeState, CharacterName, TTSSoftware, VoiceMode, VoiceModeNamesManager, TTSSoftwareType
from api.gptAI.voiceroid_api import Coeiroink, voiceroid_apiTest, voicevox_human
from api.AppSettingJson.InitMemory.InitMemoryCollection import InitMemoryCollection, InitMemoryCollectionTest
from pydantic.fields import FieldInfo


def test1():
    wa : list[MapItem[CharacterName,VoiceMode]] = [
        MapItem[CharacterName,VoiceMode](key = CharacterName(name = "one"), value = VoiceMode(mode = "one")),
        MapItem[CharacterName,VoiceMode](key = CharacterName(name = "あかね"), value = VoiceMode(mode = "つぼみ")),
    ]
    for i in wa:
        chara = i.key

    # map = (Map[CharacterName,VoiceMode].empty().
    #         set(CharacterName(name = "one"), VoiceMode(mode = "one")).
    #         set(CharacterName(name = "あかね"), VoiceMode(mode = "つぼみ")).
    #         set(CharacterName(name = "あおい"), VoiceMode(mode = "ノーマル")).
    #         set(CharacterName(name = "みずき"), VoiceMode(mode = "ノーマル")).
    #         set(CharacterName(name = "ゆう"), VoiceMode(mode = "ノーマル"))
    #     )
    
    
    
    # ExtendFunc.ExtendPrint("作成",map)

    # ExtendFunc.saveDictToJson(path, map)

    # # ロードする
    # map = Map[CharacterName,VoiceMode].loadJson(path, CharacterName, VoiceMode)
    # ExtendFunc.ExtendPrint("ロード",map)


    mapList = (Map[CharacterName,list[VoiceMode]].empty().
            set(CharacterName(name = "one"), [VoiceMode(mode = "one")]).
            set(CharacterName(name = "あかね"), [
                VoiceMode(mode = "ノーマル"), 
                VoiceMode(mode = "つぼみ"),
                VoiceMode(mode = "ほねほね")
                ]).
            set(CharacterName(name = "あおい"), [VoiceMode(mode = "ノーマル")])
        )
    
    ExtendFunc.ExtendPrintWithTitle("作成",mapList)
    path = Path("test.json")
    ExtendFunc.saveDictToJson(path, mapList)

    # ロードする
    map = Map[CharacterName,list[VoiceMode]].loadJson(path, CharacterName, list[VoiceMode])
    ExtendFunc.ExtendPrintWithTitle(["ロード","ペロ"],map)


def test2():
    mapList = (MapHasListValue[CharacterName,VoiceMode,list[VoiceMode]].empty().
            set(CharacterName(name = "one"), [VoiceMode(mode = "one")]).
            set(CharacterName(name = "あかね"), [
                VoiceMode(mode = "ノーマル"), 
                VoiceMode(mode = "つぼみ"),
                VoiceMode(mode = "ほねほね")
                ]).
            set(CharacterName(name = "あおい"), [VoiceMode(mode = "ノーマル")])
        )
    
    ExtendFunc.ExtendPrintWithTitle("作成",mapList)
    ExtendFunc.ExtendPrintWithTitle("タイプ辞書",mapList.dumpToTypedDict())
    ExtendFunc.ExtendPrintWithTitle("Json辞書",mapList.dumpToJsonDict())
    path = Path("test.json")
    ExtendFunc.saveDictToJson(path, mapList)

    # # ロードする
    map = MapHasListValue[CharacterName,VoiceMode,list[VoiceMode]].loadJson(path, CharacterName, VoiceMode,list[VoiceMode])
    ExtendFunc.ExtendPrintWithTitle(["ロード","ペロ"],map)


def test3():
    chara = CharacterName(name = "あかね")
    ExtendFunc.ExtendPrintWithTitle("作成",chara)
    mana = AllHumanInformationDict()
    ExtendFunc.ExtendPrintWithTitle("作成",mana)
    mana.save()

def test4():
    t:TTSSoftwareType = "AIVoice"
    print(t)
    s = TTSSoftware.fromType(t)
    print(s)
    t1:TTSSoftwareType = "Coeiroink"
    s1 = TTSSoftware.fromType(t1)
    print(s1)

def タスクグラフのテスト():
    inastanceManager = InastanceManager()
    charaModeState = CharacterModeState.newFromFrontName("ずんだもん")
    human = inastanceManager.humanInstances.createHuman(charaModeState)
    gptAgent:GPTAgent = inastanceManager.gptAgentInstanceManager.createGPTAgent(human = human, webSocket = None)
    gptBrain:GPTBrain = inastanceManager.agentPipeManager.createLifeProcessBrain(gptAgent)
    gptAgent.manager.GPTModeSetting
    lifeProcess:LifeProcessBrain = gptBrain.brain
    #タスクグラフを作ってグラフを実行してみる
    input: 外界からの入力 = 外界からの入力(会話 = "楕円関数のグラフを書くプログラムを書きたいな")
    asyncProcess = lifeProcess.runGraphProcess(input)
    asyncio.run(asyncProcess)

def 構造化apiテスト():
    from pydantic import BaseModel
    from openai import OpenAI

    api_key = JsonAccessor.loadOpenAIAPIKey()
    client = OpenAI(api_key = api_key)

    class カレンダーイベント(BaseModel):
        名前: str
        日付: str
        来訪者: list[str]

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "Extract the event information."},
            {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."},
        ],
        response_format=カレンダーイベント,
    )

    event = completion.choices[0].message.parsed
    ExtendFunc.ExtendPrint("event",event)




if __name__ == "__main__":
    # タスクグラフのテスト()
    # CharacterDestinationCollectionTest.目的設定を生成するてすと()
    # d = {}
    # a = GPTSettingModel(**d)
    # print(a.model_dump_json())
    # saveSettingReq = AppSettingsModel(**d)
    # print(saveSettingReq.model_dump_json())
    # JsonAccessor.saveAppSettingTest(saveSettingReq)
    テストMain()









