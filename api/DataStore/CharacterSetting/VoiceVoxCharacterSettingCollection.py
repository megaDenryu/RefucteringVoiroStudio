
from pydantic import BaseModel
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingSaveModel import VoiceVoxCharacterSettingSaveModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName


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
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "VoiceVoxCharacterSetting.json"
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
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "VoiceVoxCharacterSetting.json"
        ExtendFunc.saveBaseModelToJson(path, settinglist)
    
    def add(self, setting: VoiceVoxCharacterSettingSaveModel):
        self.collection.collection.append(setting)
        self.saveAll(self.collection)
    
    def remove(self, saveID: str):
        self.collection.collection = [x for x in self.collection.collection if x.saveID != saveID]
        self.saveAll(self.collection)

    def getByNickName(self, nickName:NickName)->list[VoiceVoxCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.characterInfo.nickName == nickName]
    
    def getBySaveID(self, saveID: str)->list[VoiceVoxCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.saveID == saveID]