
from pydantic import BaseModel
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingSaveModel import VoiceVoxCharacterSettingSaveModel
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterSaveId, NickName


class VoiceVoxCharacterSettingCollection(BaseModel):
    collection: list[VoiceVoxCharacterSettingSaveModel]

class VoiceVoxCharacterSettingCollectionOperator():
    instance: "VoiceVoxCharacterSettingCollectionOperator|None" = None
    collection: VoiceVoxCharacterSettingCollection
    def __init__(self):
        self.collection = self.loadAll()
    @staticmethod
    def singleton():
        if VoiceVoxCharacterSettingCollectionOperator.instance == None:
            VoiceVoxCharacterSettingCollectionOperator.instance = VoiceVoxCharacterSettingCollectionOperator()
        return VoiceVoxCharacterSettingCollectionOperator.instance
    @staticmethod
    def loadAll():
        path = DataDir._().CharSettingJson / "CharacterSetting" / "VoiceVoxCharacterSetting.json"
        try:
            settinglist = ExtendFunc.loadJsonToBaseModel(path, VoiceVoxCharacterSettingCollection)
        except:
            settinglist = VoiceVoxCharacterSettingCollection(collection=[])
            ExtendFunc.saveBaseModelToJson(path, settinglist)
        if settinglist == None:
            settinglist = VoiceVoxCharacterSettingCollection(collection=[])
        return settinglist
    @staticmethod
    def saveAll(settinglist: VoiceVoxCharacterSettingCollection):
        path = DataDir._().CharSettingJson / "CharacterSetting" / "VoiceVoxCharacterSetting.json"
        ExtendFunc.saveBaseModelToJson(path, settinglist)
    
    def add(self, setting: VoiceVoxCharacterSettingSaveModel):
        self.collection.collection.append(setting)
    
    def remove(self, saveID: str):
        self.collection.collection = [x for x in self.collection.collection if x.saveID != saveID]

    def getByNickName(self, nickName:NickName)->list[VoiceVoxCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.characterInfo.nickName == nickName]
    
    def getBySaveID(self, saveID: CharacterSaveId)->list[VoiceVoxCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.saveID == saveID]
    
    def save(self, data:VoiceVoxCharacterSettingSaveModel):
        """
        dataが既に存在する場合は更新、存在しない場合は追加して保存します。
        """
        if len(self.getBySaveID(data.saveID)) == 0:
            self.add(data)
        else:
            self.remove(data.saveID)
            self.add(data)
        self.saveAll(self.collection)