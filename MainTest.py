from pathlib import Path
from pprint import pprint
from api.DataStore.JsonAccessor import JsonAccessor, JsonAccessorTest
from api.DataStore.Memo import Memo, MemoTest
from api.DataStore.PickleAccessor import PickleAccessor, PickleAccessorTest
from api.Extend.ExtendFunc import ExtendFunc, ExtendFuncTest
from api.Extend.ExtendSet import Interval, ExtendSet, ExtendSetTest
from api.gptAI.HumanInformation import AllHumanInformationManager, HumanInformationTest
from api.gptAI.voiceroid_api import voiceroid_apiTest, voicevox_human



if __name__ == "__main__":
    # HumanInformationTest()
    voiceroid_apiTest()



