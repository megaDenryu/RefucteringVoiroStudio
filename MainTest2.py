import asyncio
import contextlib
from pathlib import Path
from pprint import pprint
import wave

from pydantic import BaseModel
from api.AppSettingJson.CharacterDestination.CharacterDestinationCollection import CharacterDestinationCollectionTest
from api.AppSettingJson.InitMemory.InitMemory import D_InitMemory, InitMemoryCollectionUnit
from api.DataStore.AppSetting.AppSettingModel.AppSettingInitReq import AppSettingInitReq
from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.CommentReceiveSettingModel import CommentReceiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.NiconicoLive.NiconicoLiveSettingModel import NiconicoLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.TwitchLive.TwitchSettingModel import TwitchSettingModel
from api.DataStore.AppSetting.AppSettingModel.CommentReciver.YoutubeLive.YoutubeLiveSettingModel import YoutubeLiveSettingModel
from api.DataStore.AppSetting.AppSettingModel.GPTSetting.GPTSetting import GPTSettingModel
from api.DataStore.FileProxy.api_keyProxy import api_keyProxy
from api.DataStore.Memo import Memo, MemoTest
from api.DataStore.PickleAccessor import PickleAccessor, PickleAccessorTest
from api.Extend.BaseModel.BaseModel2UIFormatConverter import 型の変換と保存
from api.Extend.BaseModel.BaseModelConverter import BaseModelConverterTest
from api.Extend.BaseModel.BaseModelListMap import MapHasListValue
from api.Extend.BaseModel.ExtendBaseModel import Map, MapItem
from api.Extend.ExtendFunc import ExtendFunc, ExtendFuncTest
from api.Extend.ExtendSet import ExtendDict, Interval, ExtendSet, ExtendSetTest
from api.Extend.ExtendSound import ExtendSound
from api.InstanceManager.InstanceManager import InastanceManager
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.LLMAPIBase.LLMInterface.ILLMAPI import IMessageQuery
from api.LLM.LLMAPIBase.OpenAI.MessageQuery import MessageQueryDict, QueryConverter
from api.LLM.エージェント.RubiConverter.KanaText import KanaText
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定テスト import LLM判定テスト
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定機ファクトリー import LLM判定機ファクトリー
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM返答判定機 import LLM返答判定機
from api.LibraryStudySample.BaseModel.FieldSample import Field_factoryを使ってみる
from api.ObjectConverter.ObjectConverterTest import generate_zod_schema, write_to_ts_file
# from api.gptAI.AgentManager import AgentManagerTest, GPTAgent, GPTBrain, LifeProcessBrain, 外界からの入力
from api.gptAI.HumanBaseModel import 利益ベクトル, 目標と利益ベクトル
from api.gptAI.HumanInfoValueObject import ICharacterName
from api.gptAI.HumanInformation import AllHumanInformationDict, AllHumanInformationManager, CharacterModeState, CharacterName, TTSSoftware, VoiceMode, VoiceModeNamesManager, TTSSoftwareType
from api.AppSettingJson.InitMemory.InitMemoryCollection import InitMemoryCollection, InitMemoryCollectionTest
from pydantic.fields import FieldInfo

from tests.test_BaseModel2UIFormatConverter import  ベースモデルのフォーマットを生成するテスト


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

# def タスクグラフのテスト():
#     inastanceManager = InastanceManager()
#     charaModeState = CharacterModeState.newFromFrontName("ずんだもん","1")
#     human = inastanceManager.humanInstances.createHuman(charaModeState)
#     gptAgent:GPTAgent = inastanceManager.gptAgentInstanceManager.createGPTAgent(human = human, webSocket = None)
#     gptBrain:GPTBrain = inastanceManager.agentPipeManager.createLifeProcessBrain(gptAgent)
#     gptAgent.manager.GPTModeSetting
#     lifeProcess:LifeProcessBrain = gptBrain.brain
#     #タスクグラフを作ってグラフを実行してみる
#     input: 外界からの入力 = 外界からの入力(会話 = "楕円関数のグラフを書くプログラムを書きたいな")
#     asyncProcess = lifeProcess.runGraphProcess(input)
#     asyncio.run(asyncProcess)

def 構造化apiテスト():
    from pydantic import BaseModel
    from openai import OpenAI

    api_key = api_keyProxy.loadOpenAIAPIKey()
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
    CharacterDestinationCollectionTest.目的設定を生成するてすと()
    
    duration = ExtendSound.get_wav_duration("./output_wav/cevio_audio_フィーちゃん_0.wav")
    print(duration)
        





