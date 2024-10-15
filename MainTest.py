from pathlib import Path
from pprint import pprint
from api.DataStore.JsonAccessor import JsonAccessor, JsonAccessorTest
from api.DataStore.Memo import Memo, MemoTest
from api.DataStore.PickleAccessor import PickleAccessor, PickleAccessorTest
from api.Extend.BaseModel.BaseModelListMap import MapHasListValue
from api.Extend.BaseModel.ExtendBaseModel import Map, MapItem
from api.Extend.ExtendFunc import ExtendFunc, ExtendFuncTest
from api.Extend.ExtendSet import Interval, ExtendSet, ExtendSetTest
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterName, HumanInformationTest, TTSSoftware, VoiceMode, VoiceModeNamesManager
from api.gptAI.voiceroid_api import Coeiroink, voiceroid_apiTest, voicevox_human



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

    ExtendFunc.saveDictToJson(path, mapList)

    # ロードする
    map = Map[CharacterName,list[VoiceMode]].loadJson(path, CharacterName, list[VoiceMode])
    ExtendFunc.ExtendPrintWithTitle(["ロード","ペロ"],mapList)


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

    ExtendFunc.saveDictToJson(path, mapList)

    # ロードする
    map = MapHasListValue[CharacterName,VoiceMode,list[VoiceMode]].loadJson(path, CharacterName, VoiceMode)
    ExtendFunc.ExtendPrintWithTitle(["ロード","ペロ"],mapList)




if __name__ == "__main__":
    # HumanInformationTest()
    # voiceroid_apiTest()
    # dict = Coeiroink.getCoeiroinkNameToNumberDict()
    # pprint(dict)
    api_dir = Path(__file__).parent / "api"

    # manager = VoiceModeNamesManager()

    voicemodes:list[VoiceMode] = [
        VoiceMode(mode = "ほねほね")
    ]
    
    path = api_dir /"CharSettingJson/VoiceModeNames/AIVoiceVoiceModes.json"
    JsonAccessor.checkExistAndCreateJson(path, {})
    
    test1()









