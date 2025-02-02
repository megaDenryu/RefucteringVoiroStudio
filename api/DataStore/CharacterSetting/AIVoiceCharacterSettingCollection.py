

from pydantic import BaseModel

from api.DataStore.CharacterSetting.AIVoiceCharacterSettingSaveModel import AIVoiceCharacterSettingSaveModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName


class AIVoiceCharacterSettingCollection(BaseModel):
    collection: list[AIVoiceCharacterSettingSaveModel]

class AIVoiceCharacterSettingCollectionOperator():
    instance: "AIVoiceCharacterSettingCollectionOperator|None" = None
    collection: AIVoiceCharacterSettingCollection
    def __init__(self):
        self.collection = self.loadAll()
    @staticmethod
    def singleton():
        if AIVoiceCharacterSettingCollectionOperator.instance == None:
            AIVoiceCharacterSettingCollectionOperator.instance = AIVoiceCharacterSettingCollectionOperator()
        return AIVoiceCharacterSettingCollectionOperator.instance
    @staticmethod
    def loadAll():
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "AIVoiceCharacterSetting.json"
        try:
            settinglist = ExtendFunc.loadJsonToBaseModel(path, AIVoiceCharacterSettingCollection)
        except:
            settinglist = AIVoiceCharacterSettingCollection(collection=[])
            ExtendFunc.saveBaseModelToJson(path, settinglist)
        if settinglist == None:
            settinglist = AIVoiceCharacterSettingCollection(collection=[])
        return settinglist
    @staticmethod
    def saveAll(settinglist: AIVoiceCharacterSettingCollection):
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "AIVoiceCharacterSetting.json"
        ExtendFunc.saveBaseModelToJson(path, settinglist)
    
    def add(self, setting: AIVoiceCharacterSettingSaveModel):
        self.collection.collection.append(setting)
    
    def remove(self, saveID: str):
        self.collection.collection = [x for x in self.collection.collection if x.saveID != saveID]

    def getByNickName(self, nickName:NickName)->list[AIVoiceCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.characterInfo.nickName == nickName]
    
    def getBySaveID(self, saveID: str)->list[AIVoiceCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.saveID == saveID]
    
    def save(self, data:AIVoiceCharacterSettingSaveModel):
        """
        dataが既に存在する場合は更新、存在しない場合は追加して保存します。
        """
        if len(self.getBySaveID(data.saveID)) == 0:
            self.add(data)
        else:
            self.remove(data.saveID)
            self.add(data)
        self.saveAll(self.collection)