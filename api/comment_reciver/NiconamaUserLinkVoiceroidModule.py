import os
from typing import Literal, TypedDict

from pydantic import BaseModel, Field
from api.DataStore.CharacterSetting.CharacterSettingCollectionOperatorManager import CharacterSettingCollectionOperatorManager
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterId, CharacterName, ICharacterName, INickName, NamePair, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager
from ..gptAI.Human import Human
from api.DataStore.JsonAccessor import JsonAccessor
import json
from pathlib import Path

class LiveCommentUserData(BaseModel):
    user_id:str                                             #ニコ生のユーザーID. 必須.
    save_id:str                                             #対象のセーブID. 必須.
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
    def loadNikonamaUserIdToCharaNameJson(self)->UserDatas:
        user_datas = JsonAccessor.loadJsonToBaseModel(self.path, UserDatas)
        if user_datas is None:
            user_datas = UserDatas(user_datas=[])
            # ファイルが存在するかチェック
            if not os.path.exists(self.path):
            # pathのファイルを作成する
                JsonAccessor.updateJsonFromBaseModel(self.path, user_datas)
        return user_datas
    
    def getUserData(self,NikonamaUserId:str)->LiveCommentUserData|None:
        """
        ユーザーIDからキャラ名を取得する
        """
        for user_data in self.user_datas.user_datas:
            if user_data.user_id == NikonamaUserId:
                return user_data
        return None
    
    def registerNikonamaUserIdToCharaInfo(self,comment,NikonamaUserId)->LiveCommentUserData|None:
        name_pair = self.getNickNameFromComment(comment)
        ExtendFunc.ExtendPrintWithTitle("コメントにキャラ指定があったのでニックネームを取得", name_pair)
        if name_pair != None:
            user_data = self.saveNikonamaUserIdToCharaName(NikonamaUserId, None,name_pair)
            self.user_datas = self.loadNikonamaUserIdToCharaNameJson()
            ExtendFunc.ExtendPrintWithTitle("ユーザーデータを登録user_data", user_data)
            ExtendFunc.ExtendPrintWithTitle("ユーザーデータを登録self.user_datas", self.user_datas)
            return user_data
        return None
    
    @staticmethod
    def checkCommentNameInNickNameList(atmark_type:Literal["@","＠"],comment:str)->NamePair|None:
        """
        コメントに含まれる名前がキャラ名リストに含まれているか確認する
        """
        name_pair_list = CharacterSettingCollectionOperatorManager.getNamePairList() + AllHumanInformationManager.singleton().nick_names_manager.allNamePair
        for name_pair in name_pair_list:
            print(name_pair.nickName.name)
            target = f"{atmark_type}{name_pair.nickName.name}"
            if target in comment:
                return name_pair
        return None

    
    def getNickNameFromComment(self,comment)->NamePair|None:
        """
        コメントから@の後ろのキャラ名を取得する
        """
        if "@" in comment:
            name_pair = self.checkCommentNameInNickNameList("@",comment)
        elif "＠" in comment:
            name_pair = self.checkCommentNameInNickNameList("＠",comment)
        else:
            return None

        if name_pair != None:
            return name_pair
        return None
             
    
    
    def saveNikonamaUserIdToCharaName(self,NikonamaUserId:str, user_name: str|None,name_pair:NamePair)->LiveCommentUserData|None:
        """
        ユーザーIDとキャラ名を紐づけてjsonに保存する
        """
        characterDataList = CharacterSettingCollectionOperatorManager.getSaveDatasFromNickName(name_pair.nickName)
        oldUserDatas = self.loadNikonamaUserIdToCharaNameJson()
        if characterDataList is not None:
            characterData = characterDataList[0]
            user_data = LiveCommentUserData(
                user_id=NikonamaUserId,
                save_id=characterData.saveID,
                user_name=user_name,
                characterName=name_pair.characterName,
                nickName=name_pair.nickName
            )
        else:
            user_data = LiveCommentUserData(
                user_id=NikonamaUserId,
                save_id="",
                user_name=user_name,
                characterName=name_pair.characterName,
                nickName=name_pair.nickName
            )
        oldUserDatas.user_datas.append(user_data)
        # ファイルに保存
        JsonAccessor.updateJsonFromBaseModel(self.path, oldUserDatas)
        return user_data