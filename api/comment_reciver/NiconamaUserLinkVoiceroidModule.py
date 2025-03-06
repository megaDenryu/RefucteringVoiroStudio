import os
from typing import Literal, TypedDict

from pydantic import BaseModel, Field
from api.DataStore.CharacterSetting.CharacterSettingCollectionOperatorManager import CharacterSettingCollectionOperatorManager
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterId, CharacterName, ICharacterName, INickName, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager
from ..gptAI.Human import Human
from api.DataStore.JsonAccessor import JsonAccessor
import json
from pathlib import Path

class LiveCommentUserData(BaseModel):
    user_id:str                                             #ニコ生のユーザーID. 必須.
    save_id:str                                      #対象のセーブID. 必須.
    user_name:str|None = Field(default=None)                #ユーザー名. 任意.
    characterName:CharacterName|None = Field(default=None)  #キャラ名. 任意.
    nickName:NickName|None = Field(default=None)            #ニックネーム. 任意.

class ILiveCommentUserData(TypedDict):
    user_id:str
    save_id:str
    user_name:str|None
    characterName:ICharacterName|None
    nickName:INickName|None

def toILiveCommentUserData(data:LiveCommentUserData|None)->ILiveCommentUserData|None:
    if data is None:
        return None
    return data.model_dump() # type: ignore

class UserDatas(BaseModel):
    user_datas:list[LiveCommentUserData]


class NiconamaUserLinkVoiceroidModule:
    path:Path
    user_datas:UserDatas

    def __init__(self):
        self.path = ExtendFunc.api_dir / "AppSettingJson" / "NikonamaUserData.json"
        self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
    def loadNikonamaUserIdToCharaNameJson(self):
        user_data = JsonAccessor.loadJsonToBaseModel(self.path, UserDatas)
        if user_data is None:
            user_data = UserDatas(user_datas=[])
            # ファイルが存在するかチェック
            if not os.path.exists(self.path):
            # pathのファイルを作成する
                JsonAccessor.updateJsonFromBaseModel(self.path, user_data)
        return user_data
    
    def getUserData(self,NikonamaUserId:str)->LiveCommentUserData|None:
        """
        ユーザーIDからキャラ名を取得する
        """
        for user_data in self.user_datas.user_datas:
            if user_data.user_id == NikonamaUserId:
                return user_data
        return None
    
    def registerNikonamaUserIdToCharaInfo(self,comment,NikonamaUserId)->LiveCommentUserData|None:
        nick_name = self.getNickNameFromComment(comment)
        if nick_name != None:
            user_data = self.saveNikonamaUserIdToCharaName(NikonamaUserId, None,nick_name)
            self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
            return user_data
        return None
    
    @staticmethod
    def checkCommentNameInNickNameList(atmark_type:Literal["@","＠"],comment:str)->NickName|Literal[None]:
        """
        コメントに含まれる名前がキャラ名リストに含まれているか確認する
        """
        nickNameList = CharacterSettingCollectionOperatorManager.getNickNameList() + AllHumanInformationManager.singleton().nick_names_manager.allNicknames
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
             
    
    
    def saveNikonamaUserIdToCharaName(self,NikonamaUserId:str, user_name: str|None,nickName: NickName)->LiveCommentUserData|None:
        """
        ユーザーIDとキャラ名を紐づけてjsonに保存する
        """
        # 既存のデータを読み込む
        characterDataList = CharacterSettingCollectionOperatorManager.getSaveDatasFromNickName(nickName)
        if characterDataList is None:
            return None
        characterData = characterDataList[0]
        oldUserDatas = self.loadNikonamaUserIdToCharaNameJson()
        user_data = LiveCommentUserData(
            user_id=NikonamaUserId,
            save_id=characterData.saveID,
            user_name=user_name,
            characterName=characterData.characterInfo.characterName,
            nickName=nickName
        )
        oldUserDatas.user_datas.append(user_data)
        # ファイルに保存
        JsonAccessor.updateJsonFromBaseModel(self.path, oldUserDatas)
        return user_data