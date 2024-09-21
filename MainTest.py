from pathlib import Path
from pprint import pprint
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.Memo import Memo
from api.DataStore.PickleAccessor import PickleAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.ExtendSet import Interval, ExtendSet, Test

def MemoTest():
    memo = Memo()
    memo.insertTodayMemo("test")

def PickleTest():
    pickleAccessor = PickleAccessor()
    ExtendFunc.ExtendPrint(pickleAccessor.path)

def JsonAccsessTest():
    pudate = {}
    pudate["ニコ生コメントレシーバー設定"] = {}
    pudate["ニコ生コメントレシーバー設定"]["生放送URL"] = "test"
    JsonAccessor.updateAppSettingJson(pudate)




if __name__ == "__main__":
    Test()

