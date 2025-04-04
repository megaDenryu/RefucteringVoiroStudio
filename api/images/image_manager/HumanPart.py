from __future__ import annotations # annotationsを有効にする
from typing import TYPE_CHECKING, Literal, TypedDict
import sys
import json
from pathlib import Path
import os
import base64
from pprint import pprint
import re
from collections import OrderedDict
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import CharacterName, HumanImage
from api.images.image_manager.IHumanPart import BodyPartsImages, AllBodyFileInfo, HumanData, InitImageInfo

if TYPE_CHECKING:
    from api.gptAI.Human import Human

class HumanPart:
    chara_name:CharacterName
    human_image:HumanImage
    @property
    def name(self)->str:
        return self.chara_name.name
    def __init__(self,chara_name:CharacterName, humanImage:HumanImage) -> None:
        self.chara_name = chara_name
        self.human_image = humanImage
        self.api_dir = ExtendFunc.getTargetDirFromParents(__file__,"api")
    
    def getCharFilePath(self,characterName:CharacterName,human_image:HumanImage,psd_num:int|None = None):
        
        char_file_path = DataDir._().CharSettingJson / "CharFilePath.json"
        with open(char_file_path, 'r', encoding='utf-8') as f:
            name_list:dict[str,list[str]] = json.load(f)
        ExtendFunc.ExtendPrintWithTitle("name_list",name_list)
        if psd_num != None:
            file_path = f"{characterName.name}/{name_list[characterName.name][psd_num]}"
        else:
            image_name = human_image.folder_name
            file_path = f"{characterName.name}/{image_name}"
        print("file_path",file_path)
        return file_path
    
    @staticmethod
    def writeCharFilePathToNewPSDFileName(chara_name:CharacterName,human_image:HumanImage):
        CharFilePath_path = DataDir._().CharSettingJson / "CharFilePath.json"
        CharFilePathDict:dict[str,list[str]] = ExtendFunc.loadJsonToDict(CharFilePath_path)
        if chara_name.name in CharFilePathDict:
            CharFilePathDict[chara_name.name].insert(0,human_image.folder_name)
        else:
            CharFilePathDict[chara_name.name] = [human_image.folder_name]
        ExtendFunc.saveDictToJson(CharFilePath_path,CharFilePathDict)

    def getHumanAllParts(self, human_char_name:CharacterName, front_name:str, human_image:HumanImage, psd_num:int|None = None) -> tuple[HumanData, AllBodyFileInfo]:
        #入力名からキャラの正式名を取得
        char_file_path = self.getCharFilePath(human_char_name,human_image,psd_num)
        #キャラの正式名からキャラの体パーツフォルダの画像のpathを取得
        path_str = str(HumanPart.getVoiroCharaImageFolderPath() / char_file_path)
        return self.getHumanAllPartsFromPath(human_char_name,front_name, path_str)
    
    def getHumanAllPartsFromPath(self, human_char_name:CharacterName, front_name:str, path_str:str)->tuple[HumanData, AllBodyFileInfo]:
        #キャラの体パーツフォルダの画像を全て辞書形式で取得
        body_parts_iamges:BodyPartsImages
        body_parts_pathes_for_gpt:AllBodyFileInfo
        body_parts_iamges,body_parts_pathes_for_gpt = self.recursive_file_check(f"{path_str}/parts")
        self.saveImageInfo(body_parts_pathes_for_gpt, path_str, body_parts_iamges)
        init_image_info = self.getInitImageInfo(path_str)
        data_for_client:HumanData = {
            "body_parts_iamges":body_parts_iamges,
            "init_image_info":init_image_info,
            "front_name":front_name,
            "char_name":human_char_name.name
        }
        return data_for_client,body_parts_pathes_for_gpt

    def openFile(self,file_path):
        # ファイルをバイナリー形式で開く
        with open(file_path,mode="rb") as f:
            binary_data = f.read()
        # ファイル情報をjsonに文字列として入れるためにファイルのバイナリーデータをbase64エンコードする
        binary_data_b64 = base64.encodebytes(binary_data)
        return binary_data_b64.decode()
        #return file_path
    
    def openJsonFile(self,file_path):
        # jsonファイルを開いて、辞書型に変換する
        with open(file_path,encoding="UTF8") as f:
            json_data = json.load(f)
        return json_data
    
    def saveJsonFile(self,file_path,json_data):
        """
        file_pathがあれば上書き、なければ新規作成
        """
        #file_pathがない場合
        if not os.path.exists(file_path):
            #ディレクトリがなければ作成
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, mode="w", encoding="utf-8") as f:
                json.dump(json_data, f, ensure_ascii=False, indent=4)
        else:
            #file_pathがある場合上書きする
            with open(file_path,mode="w",encoding="utf-8") as f:
                json.dump(json_data, f, ensure_ascii=False, indent=4)

    def recursive_file_check(self,path_str:str) -> tuple[dict, dict]:
        path = Path(path_str)
        file_names:list[str] = os.listdir(path)
        dict = {}
        filepath_dict = {} #gptにファイル構造を渡すために全てのパスを文字列で取得
        for file_name in file_names:
            #print(file_name)
            file_path = f"{path_str}/{file_name}"
            if os.path.isdir(file_path):
                # directoryだったら中のファイルに対して再帰的にこの関数を実行
                data,pathes = self.recursive_file_check(file_path)
                dict[file_path.split("/")[-1]] = data
                filepath_dict[file_path.split("/")[-1]] = pathes
            else:
                # fileだったら処理
                key = file_path.split("/")[-1].split(".")[0]
                if key not in dict.keys():
                    dict[key] = {}
                if file_path.endswith(".png") or file_path.endswith(".jpg"):
                    data = self.openFile(file_path)
                    pathes = "gazou"
                    dict[key]["img"] = data
                    filepath_dict[file_path.split("/")[-1]] = pathes
                elif file_path.endswith(".json"):
                    data = self.openJsonFile(file_path)
                    pathes = "json"
                    dict[key]["json"] = data
                    filepath_dict[file_path.split("/")[-1]] = pathes
                else:
                    print("pngでもjsonでもないファイルがありました。")
                    print(f"{file_path=}")
        return dict, filepath_dict
    
    def getInitImageInfo(self,path_str:str)->InitImageInfo:
        """
        pathからキャラpsdの初期状態をインポートする
        """
        init_image_info:InitImageInfo
        path_str = f"{path_str}/init_image_info.json"
        path = Path(path_str)
        #jsonファイルを開く
        try:
            with open(path_str,encoding="UTF8") as f:
                init_image_info = json.load(f)
                #jsonファイルの中身を確認
            ExtendFunc.ExtendPrint(init_image_info, "init_image_info.jsonの中身")
            return init_image_info
        except Exception as e:
            print(e)
            print(f"init_image_info.jsonが見つかりませんでした。path:{path}")
            raise e
        
    def saveImageInfo(self,info_dict:dict, path_str:str, body_parts_iamges:dict):
        save_switch = False
        # もしinit_image_info.jsonがなかったら作成する
        if not os.path.exists(f"{path_str}/init_image_info.json"):
            save_switch = True
        if True == save_switch :
            init_dict = {}
            for key in info_dict.keys():
                part_image_dict = info_dict[key]
                #part_image_dictのキー配列の最初の要素を取得。hoge.pngやhoge.jsonのhogeの部分を取得。
                mode_human_part_manager = "HumanPartManager2"
                if mode_human_part_manager == "iHumanPartManager":
                    #iHumanPartManager用の処理
                    init_dict[key] = list(part_image_dict.keys())[0].split(".")[0]
                elif mode_human_part_manager == "HumanPartManager2":
                    #HumanPartManager2用の処理
                    init_dict[key] = self.allPartNameDict(part_image_dict, body_parts_iamges[key])
                
                

            # そのままinfo_dictをinit_image_info.jsonに保存するとキー名に対して昇順にならないので、昇順に並び変える
            ordereddictdata = OrderedDict({k: v for k, v in sorted(info_dict.items(), key=lambda item: int(re.split('_', item[0])[0]))})
            init_ordereddictdata = OrderedDict({k: v for k, v in sorted(init_dict.items(), key=lambda item: int(re.split('_', item[0])[0]))})
            save_data = {
                "init":init_ordereddictdata,
                "all_data":ordereddictdata
            }

            with open(f"{path_str}/init_image_info.json",mode="w",encoding="utf-8") as f:
                json.dump(save_data,f,indent=4,ensure_ascii=False)
    
    def allPartNameDict(self,part_image_dict:dict ,body_parts_iamge:dict):
        """
        part_image_dictのキー配列の最初の要素を取得。hoge.pngやhoge.jsonのhogeの部分を取得。
        """
        return_dict = {}
        all_part_name_list = part_image_dict.keys()
        for part_name in all_part_name_list:
            part_name = part_name.split(".")[0]
            if body_parts_iamge[part_name]["json"]["initial_display"] == True:
                return_dict[part_name] = "on"
            else:
                return_dict[part_name] = "off"

        return return_dict
        
    def saveHumanImageCombination(self,combination_data,combination_name,psd_num):
        """
        init_image_info.jsonの中にcombination_nameのキーでcombination_dataを保存する
        """
        char_file_path = self.getCharFilePath(self.chara_name,self.human_image ,psd_num)
        path_str = str(HumanPart.getVoiroCharaImageFolderPath() / char_file_path)
        init_image_info = self.getInitImageInfo(path_str)
        init_image_info[combination_name] = combination_data
        self.saveJsonFile(f"{path_str}/init_image_info.json",init_image_info)
    
    @staticmethod
    def getVoiroCharaImageFolderPath():
        """
        ボイロキャラの画像フォルダのパスを取得する
        """
        root_dir = ExtendFunc.api_dir.parent
        target_dir = root_dir / "ボイロキャラ素材"
        return target_dir
    
    @staticmethod
    def checkExistVoiroCharaImageFolder():
        """
        ボイロキャラの画像フォルダが存在するか確認する
        """
        target_dir = HumanPart.getVoiroCharaImageFolderPath()
        return os.path.exists(target_dir)
    
    @staticmethod
    def createVoiroCharaImageFolder():
        """
        ボイロキャラの画像フォルダを作成する
        """
        target_dir = HumanPart.getVoiroCharaImageFolderPath()
        os.makedirs(target_dir, exist_ok=True)
    
    @staticmethod
    def checkExistVoiroCharaImageFolderAndCreate():
        """
        ボイロキャラの画像フォルダが存在しなければ作成する
        """
        if not HumanPart.checkExistVoiroCharaImageFolder():
            HumanPart.createVoiroCharaImageFolder()
            ExtendFunc.ExtendPrint("ボイロキャラの画像フォルダがなかったので作成しました。")
        else:
            ExtendFunc.ExtendPrint("ボイロキャラの画像フォルダが正常に存在します。")
    
    @staticmethod
    def checkNameExistInVoiroCharaImageFolderAndCreate(name:str):
        """
        ボイロキャラの画像フォルダにnameのフォルダが存在するか確認して、存在しなければ作成する
        """
        target_dir = HumanPart.getVoiroCharaImageFolderPath()
        os.makedirs(target_dir / name, exist_ok=True)
    
    @staticmethod
    def checkAllNameExistInVoiroCharaImageFolderAndCreate():
        """
        ボイロキャラの画像フォルダに名前が存在するかをすべてのボイロについて確認して、存在しなければ作成する
        """

        # CharaFilePathのキャラ名キーがすべてそろっているかチェックする
        # chara_name_list = HumanPart.getAllCharacterName()

        path = DataDir._().CharSettingJson / "CharFilePath.json"
        # pathが存在しない場合は作成する
        if not os.path.exists(path):
            ExtendFunc.saveDictToJson(path,{})
        chara_name_dict = ExtendFunc.loadJsonToDict(path)
        for chara_name in chara_name_dict:
            HumanPart.checkNameExistInVoiroCharaImageFolderAndCreate(chara_name)

    @staticmethod
    def initalCheck():
        """
        ボイロキャラの画像フォルダが存在しなければ作成する
        """
        HumanPart.checkExistVoiroCharaImageFolderAndCreate()
        HumanPart.checkAllNameExistInVoiroCharaImageFolderAndCreate()

    @staticmethod
    def getAllCharacterName():
        cevio_names:list[str] = HumanPart.getCevioAllName()
        aivoice_names:list[str] = HumanPart.getAIVoiceAllNames()
        voicevoc_names:list[str] = HumanPart.getVoiceVoxAllNames()
        coeiroink_names:list[str] = HumanPart.getCoeiroinkAllNames()
        all_names = cevio_names + aivoice_names + voicevoc_names + coeiroink_names
        return all_names
    
    @staticmethod
    def getCevioAllName():
        #最新の状態を取得するにはcevioを起動しておかないといけないので何かcevioを起動しているか見れる変数を用意してたはずなのでそれを見て確認し、してないときはとらないようにする

        is_cevio_acticve = False
        if is_cevio_acticve:
            chara_names = []
        else:
            #CevioNameForVoiceroidAPI.jsonから名前を取得
            path = DataDir._().CharSettingJson / "CevioNameForVoiceroidAPI.json"
            chara_names = ExtendFunc.loadJsonToList(path)
        return chara_names
    
    @staticmethod
    def getAIVoiceAllNames():
        is_aivoice_active = False
        if is_aivoice_active:
            chara_names = []
        else:
            path = DataDir._().CharSettingJson / "AIVOICENameForVoiceroidAPI.json"
            chara_names = ExtendFunc.loadJsonToList(path)
        return chara_names

    @staticmethod
    def getVoiceVoxAllNames():
        is_voicevox_active = False
        if is_voicevox_active:
            chara_names = []
        else:
            path = DataDir._().CharSettingJson / "VoiceVoxNameForVoiceroidAPI.json"
            chara_names = ExtendFunc.loadJsonToList(path)
        return chara_names

    
    @staticmethod
    def getCoeiroinkAllNames():
        is_coeiroink_active = False
        if is_coeiroink_active:
            chara_names = []
        else:
            path = DataDir._().CharSettingJson / "CoeiroinkNameForVoiceroidAPI.json"
            chara_names = ExtendFunc.loadJsonToList(path)
        return chara_names