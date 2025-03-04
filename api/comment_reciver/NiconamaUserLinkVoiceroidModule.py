import os
from typing import Literal

from pydantic import BaseModel, Field
from api.DataStore.CharacterSetting.CharacterSettingCollectionOperatorManager import CharacterSettingCollectionOperatorManager
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterId, CharacterName, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager
from ..gptAI.Human import Human
from api.DataStore.JsonAccessor import JsonAccessor
import json

class UserData(BaseModel):
    user_id:str                                             #ニコ生のユーザーID. 必須.
    save_id:str                                      #対象のセーブID. 必須.
    user_name:str|None = Field(default=None)                #ユーザー名. 任意.
    characterName:CharacterName|None = Field(default=None)  #キャラ名. 任意.
    nickName:NickName|None = Field(default=None)            #ニックネーム. 任意.

class UserDatas(BaseModel):
    user_datas:list[UserData]


class NiconamaUserLinkVoiceroidModule:
    user_datas:UserDatas

    def __init__(self):
        self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
    
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
    
    def getUserData(self,NikonamaUserId:str):
        """
        ユーザーIDからキャラ名を取得する
        """
        for user_data in self.user_datas.user_datas:
            if user_data.user_id == NikonamaUserId:
                return user_data
        return None
    
    def registerNikonamaUserIdToCharaName(self,comment,NikonamaUserId)->UserData|None:
        nick_name = self.getNickNameFromComment(comment)
        if nick_name != None:
            user_data = self.saveNikonamaUserIdToCharaName(NikonamaUserId, None,nick_name)
            self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
            return user_data
        return None
    
    @staticmethod
    def checkCommentNameInNickNameList(atmark_type,comment:str)->NickName|Literal[None]:
        """
        コメントに含まれる名前がキャラ名リストに含まれているか確認する
        """
        nickNameList = CharacterSettingCollectionOperatorManager.getNickNameList()
        for nickName in nickNameList:
            target = f"{atmark_type}{nickName.name}"
            if target in comment:
                return nickName
        return None

    
    def getNickNameFromComment(self,comment):
        """
        コメントから@の後ろのキャラ名を取得する
        """
        if "@" in comment:
            nick_name = self.checkCommentNameInNickNameList("@",comment)
        elif "＠" in comment:
            nick_name = self.checkCommentNameInNickNameList("＠",comment)
        else:
            return None

        if nick_name != None:
            return nick_name
        return None
             
    
    
    def saveNikonamaUserIdToCharaName(self,NikonamaUserId:str, user_name: str|None,nickName: NickName)->UserData|None:
        """
        ユーザーIDとキャラ名を紐づけてjsonに保存する
        """
        # 既存のデータを読み込む
        characterDataList = CharacterSettingCollectionOperatorManager.getOperatorFromNickName(nickName)
        if characterDataList is None:
            return None
        characterData = characterDataList[0]
        oldUserDatas = self.loadNikonamaUserIdToCharaNameJson()
        user_data = UserData(
            user_id=NikonamaUserId,
            save_id=characterData.saveID,
            user_name=user_name,
            characterName=characterData.characterInfo.characterName,
            nickName=nickName
        )
        oldUserDatas.user_datas.append(user_data)
        return user_data