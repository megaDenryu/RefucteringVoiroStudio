
from pydantic import BaseModel, Field

from api.DataStore.CharacterSetting.CevioAICharacterSettingSaveModel import CevioAICharacterSettingSaveModel
from api.DataStore.CharacterSetting.CharacterInfo.CharacterInfo import CharacterInfo
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxVoiceSettingModel import VoiceVoxVoiceSettingModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName



class CevioAICharacterSettingCollection(BaseModel):
    collection: list[CevioAICharacterSettingSaveModel]

class CevioAICharacterSettingCollectionOperator():
    instance: "CevioAICharacterSettingCollectionOperator|None" = None
    collection: CevioAICharacterSettingCollection
    def __init__(self):
        self.collection = self.loadAll()
    @staticmethod
    def singleton():
        if CevioAICharacterSettingCollectionOperator.instance == None:
            CevioAICharacterSettingCollectionOperator.instance = CevioAICharacterSettingCollectionOperator()
        return CevioAICharacterSettingCollectionOperator.instance
    @staticmethod
    def loadAll():
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "CevioAICharacterSetting.json"
        try:
            settinglist = ExtendFunc.loadJsonToBaseModel(path, CevioAICharacterSettingCollection)
        except:
            settinglist = CevioAICharacterSettingCollection(collection=[])
            ExtendFunc.saveBaseModelToJson(path, settinglist)
        if settinglist == None:
            settinglist = CevioAICharacterSettingCollection(collection=[])
        return settinglist
    @staticmethod
    def saveAll(settinglist: CevioAICharacterSettingCollection):
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "CevioAICharacterSetting.json"
        ExtendFunc.saveBaseModelToJson(path, settinglist)
    
    def add(self, setting: CevioAICharacterSettingSaveModel):
        self.collection.collection.append(setting)
        self.saveAll(self.collection)
    
    def remove(self, saveID: str):
        self.collection.collection = [x for x in self.collection.collection if x.saveID != saveID]
        self.saveAll(self.collection)

    def getByNickName(self, nickName:NickName)->list[CevioAICharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.characterInfo.nickName == nickName]
    
    def getBySaveID(self, saveID: str)->list[CevioAICharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.saveID == saveID]

