import os
from typing import Literal

from pydantic import BaseModel, Field
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterId, CharacterName, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager
from ..gptAI.Human import Human
from api.DataStore.JsonAccessor import JsonAccessor
import json

class UserData(BaseModel):
    user_id:str                                             #ニコ生のユーザーID. 必須.
    characterId:CharacterId                                 #対象のキャラクターID. 必須.
    user_name:str|None = Field(default=None)                #ユーザー名. 任意.
    characterName:CharacterName|None = Field(default=None)  #キャラ名. 任意.
    nickName:NickName|None = Field(default=None)            #ニックネーム. 任意.

class UserDatas(BaseModel):
    user_datas:list[UserData]


class NiconamaUserLinkVoiceroidModule:
    user_datas:UserDatas

    def __init__(self):
        self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
    
        import os
    
    def loadNikonamaUserIdToCharaNameJson(self):
        path = ExtendFunc.api_dir / "AppSettingJson" / "NikonamaUserData.json"
    
        # ファイルが存在するかチェック
        if not os.path.exists(path):
            # ファイルが存在しない場合は作成する
            with open(path, 'w') as f:
                json.dump(UserDatas(user_datas=[]).dict(), f, indent=4)
    
        user_data = JsonAccessor.loadJsonToBaseModel(path, UserDatas)
        if user_data is None:
            user_data = UserDatas(user_datas=[])
            # pathのファイルを作成する
            with open(path, 'w') as f:
                json.dump(user_data.dict(), f, indent=4)
        return user_data
    
    def getCharaNameByNikonamaUser(self,NikonamaUserId):
        """
        ユーザーIDからキャラ名を取得する
        """
        NikonamaUserId = str(NikonamaUserId)
        if NikonamaUserId in self.user_datas:
            return self.user_datas[NikonamaUserId].replace("*","")
        else:
            return "キャラ名は登録されていませんでした"
    
    def registerNikonamaUserIdToCharaName(self,comment,NikonamaUserId)->CharacterName | Literal['名前が無効です'] :
        chara_name = self.getCharaNameFromComment(comment)
        if chara_name != "名前が無効です":
            self.saveNikonamaUserIdToCharaName(NikonamaUserId, chara_name)
            self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
        return chara_name

    
    def getCharaNameFromComment(self,comment):
        """
        コメントから@の後ろのキャラ名を取得する
        """
        if "@" in comment:
            chara_name = Human.checkCommentNameInNameList("@",comment)
        elif "＠" in comment:
            chara_name = Human.checkCommentNameInNameList("＠",comment)
        else:
            return "名前が無効です"

        if chara_name != "名前が無効です":
            return chara_name
        return "名前が無効です"
             
    
    
    def saveNikonamaUserIdToCharaName(self,NikonamaUserId, chara_name):
        """
        ユーザーIDとキャラ名を紐づけてjsonに保存する
        """
        # 既存のデータを読み込む
        data = self.loadNikonamaUserIdToCharaNameJson()
        NikonamaUserId = str(NikonamaUserId)
        if NikonamaUserId in data and "*" in data[NikonamaUserId]:
            print("このユーザーはキャラを変更できません")
            return

        # ユーザーIDとキャラ名を紐づける
        data[NikonamaUserId] = chara_name

        # データをjsonに保存する
        JsonAccessor.saveNikonamaUserIdToCharaNameJson(data)