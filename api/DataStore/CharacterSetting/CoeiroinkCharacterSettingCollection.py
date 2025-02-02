
from pydantic import BaseModel
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingSaveModel import CoeiroinkCharacterSettingSaveModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName


class CoeiroinkCharacterSettingCollection(BaseModel):
    collection: list[CoeiroinkCharacterSettingSaveModel]

class CoeiroinkCharacterSettingCollectionOperator():
    instance: "CoeiroinkCharacterSettingCollectionOperator|None" = None
    collection: CoeiroinkCharacterSettingCollection
    def __init__(self):
        self.collection = self.loadAll()
    @staticmethod
    def singleton():
        if CoeiroinkCharacterSettingCollectionOperator.instance == None:
            CoeiroinkCharacterSettingCollectionOperator.instance = CoeiroinkCharacterSettingCollectionOperator()
        return CoeiroinkCharacterSettingCollectionOperator.instance
    @staticmethod
    def loadAll():
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "CoeiroinkCharacterSetting.json"
        try:
            settinglist = ExtendFunc.loadJsonToBaseModel(path, CoeiroinkCharacterSettingCollection)
        except:
            settinglist = CoeiroinkCharacterSettingCollection(collection=[])
            ExtendFunc.saveBaseModelToJson(path, settinglist)
        if settinglist == None:
            settinglist = CoeiroinkCharacterSettingCollection(collection=[])
        return settinglist
    @staticmethod
    def saveAll(settinglist: CoeiroinkCharacterSettingCollection):
        path = ExtendFunc.api_dir / "CharSettingJson" / "CharacterSetting" / "CoeiroinkCharacterSetting.json"
        ExtendFunc.saveBaseModelToJson(path, settinglist)
    
    def add(self, setting: CoeiroinkCharacterSettingSaveModel):
        self.collection.collection.append(setting)
    
    def remove(self, saveID: str):
        self.collection.collection = [x for x in self.collection.collection if x.saveID != saveID]

    def getByNickName(self, nickName:NickName)->list[CoeiroinkCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.characterInfo.nickName == nickName]
    
    def getBySaveID(self, saveID: str)->list[CoeiroinkCharacterSettingSaveModel]:
        return [x for x in self.collection.collection if x.saveID == saveID]
    
    def save(self, data:CoeiroinkCharacterSettingSaveModel):
        """
        dataが既に存在する場合は更新、存在しない場合は追加して保存します。
        """
        if len(self.getBySaveID(data.saveID)) == 0:
            self.add(data)
        else:
            self.remove(data.saveID)
            self.add(data)
        self.saveAll(self.collection)