import sys
from pathlib import Path
import os
import json
import time
import re
from pprint import pprint
from typing_extensions import TypedDict

from api.Extend.ExtendFunc import ExtendFunc, TextConverter
from api.gptAI.HumanInfoValueObject import CharacterName, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterModeState, TTSSoftware
from api.images.image_manager.IHumanPart import HumanData
from .gpt import ChatGPT
from .voiceroid_api import voicevox_human
from .voiceroid_api import Coeiroink

from ..images.image_manager.HumanPart import HumanPart
from starlette.websockets import WebSocket

try:
    from .voiceroid_api import cevio_human
except ImportError:
    print("cevio_human module could not be imported. Please ensure the required application is installed.")

try:
    from .voiceroid_api import AIVoiceHuman
except ImportError:
    print("AIVoiceHuman module could not be imported. Please ensure the required application is installed.")



class Human:
    chara_mode_state:CharacterModeState
    image_data_for_client:HumanData
    @property
    def front_name(self): #フロントで入力してウインドウに表示されてる名前
        return self.chara_mode_state.front_name
    @property
    def char_name(self): #キャラ名
        return self.chara_mode_state.character_name
    @property
    def id(self):
        return self.chara_mode_state.id
    def __init__(self,chara_mode_state:CharacterModeState ,voiceroid_dict) -> None:
        """
        @param front_name: フロントで入力してウインドウに表示されてる名前
        @param voiceroid_dict: 使用してる合成音声の種類をカウントする辞書。{"cevio":0,"voicevox":0,"AIVOICE":0}。cevioやAIVOICEの起動管理に使用。
        """
        # debug用の変数
        self.voice_switch = True
        self.gpt_switch = True
        self.send_image_switch = True

        # 以下コンストラクタのメイン処理
        self.chara_mode_state = chara_mode_state
        self.voice_mode = "wav出力"

        print(f"char_name:{self.char_name.name}")
        self.personal_id = 2
        # 体画像周りを準備する
        self.human_part = HumanPart(self.char_name)
        self.image_data_for_client,self.body_parts_pathes_for_gpt = self.human_part.getHumanAllParts(self.char_name.name, self.front_name)
        # dictを正規化する
        self.response_dict:dict = {
            self.char_name.name:"",
            "感情":"",
            "コード":"",
            "json返答":""
        }
        self.sentence = ""
        self.sentence_count = 0
        self.voice_system:str = self.start(voiceroid_dict)

    
    def start(self, voiceroid_dict:dict[str,int] = {"cevio":0,"voicevox":0,"AIVOICE":0,"Coeiroink":0}):#voiceroid_dictはcevio,voicevox,AIVOICEの数をカウントする
        if self.voice_switch:
            if TTSSoftware.CevioAI.equal(self.chara_mode_state.tts_software):
                tmp_cevio = cevio_human.createAndUpdateALLCharaList(self.chara_mode_state,voiceroid_dict["cevio"])
                print(f"{self.char_name}のcevio起動開始")
                self.human_Voice = tmp_cevio
                print(f"{self.char_name}のcevio起動完了")
                self.human_Voice.speak("起動完了")
                return "cevio"
            elif TTSSoftware.VoiceVox.equal(self.chara_mode_state.tts_software):
                tmp_voicevox = voicevox_human(self.chara_mode_state,voiceroid_dict["voicevox"])
                print(f"{self.char_name}のvoicevox起動開始")
                self.human_Voice = tmp_voicevox
                print(f"{self.char_name}のvoicevox起動完了")
                self.human_Voice.speak("起動完了")
                return "voicevox"
            elif TTSSoftware.AIVoice.equal(self.chara_mode_state.tts_software):
                tmp_aivoice = AIVoiceHuman.createAndUpdateALLCharaList(self.chara_mode_state, voiceroid_dict["AIVOICE"])
                print(f"{self.char_name}のAIVOICE起動開始")
                self.human_Voice = tmp_aivoice
                print(f"{self.char_name}のAIVOICE起動完了")
                self.human_Voice.speak("起動完了")
                return "AIVOICE"
            elif TTSSoftware.Coeiroink.equal(self.chara_mode_state.tts_software):
                tmp_coeiroink = Coeiroink(self.chara_mode_state, voiceroid_dict["Coeiroink"])
                print(f"{self.char_name}のcoeiroink起動開始")
                self.human_Voice = tmp_coeiroink
                print(f"{self.char_name}のcoeiroink起動完了")
                return "Coeiroink"
            else:
                return "ボイロにいない名前が入力されたので起動に失敗しました。"
        else:
            print(f"ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。")
            return "ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。"
    
    def speak(self,str:str):
        self.human_Voice.speak(str)

    def outputWaveFile(self,str:str):
        str = str.replace(" ","").replace("　","")
        # str = TextConverter.convertReadableJapanaeseSentense(str)
        if cevio_human == type(self.human_Voice):
            print("cevioでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif AIVoiceHuman == type(self.human_Voice):
            print("AIvoiceでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif voicevox_human == type(self.human_Voice):
            print("voicevoxでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif Coeiroink == type(self.human_Voice):
            print("coeiroinkでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        else:
            print("wav出力できるボイロが起動してないのでwav出力できませんでした。")

    def format_response(self,text:str):
        """
        gptから送られてきたjson文字列を辞書に代入する関数
        """
        try:
            tmp_dict:dict = json.loads(text)
            for key in self.response_dict.keys():
                if key in tmp_dict:
                    self.response_dict[key] = tmp_dict[key]
                else:
                    self.response_dict[key] = ""
            self.response_dict["json返答"] = "成功"
            self.saveResponse()
        except Exception as e:
            # textがjson形式でない時はエラーになるのでtextをそのまま全部会話の部分に入れる。
            self.response_dict[self.char_name] = text
            self.response_dict["json返答"] = "失敗"

    def appendSentence(self,input_sentence:str, inputer_name:str):
        if self.sentence_count == 0:
            self.sentence = f"{inputer_name}:{input_sentence}"
        else:
            self.sentence = f"{self.sentence}, {inputer_name}:{input_sentence}"
        self.sentence_count += 1
        return self.sentence,self.sentence_count
    def resetSentence(self):
        self.sentence = ""

    def execLastResponse(self):
        if "成功" == self.response_dict["json返答"]:
            print("json返答に成功してるので発声します")
            if "直接発声" == self.voice_mode:
                self.speak(self.response_dict[self.char_name])
            elif "wav出力" == self.voice_mode:
                self.outputWaveFile(self.response_dict[self.char_name])
            self.execGPTsCode(self.response_dict["コード"])
            # 反応がなければもう一度続きの反応を生成して声をかける処理を入れる
        else:
            print("json返答に失敗したので発声を中止します")

    def saveResponse(self):
        pass
    
    def execGPTsCode(self,code_text:str):
        """
        コードテキストを実行可能な形に整形
        """
        replace_words = [
            "```python\\n",
            "```"
        ]
        for word in replace_words:
            try:
                code_text.replace(word,"")
            except Exception as e:
                print("プログラムの形式がおかしいです")
        try:
            ret = eval(code_text)
            self.speak(ret)
        except Exception as e:
            print(e)
            try:
                exec(code_text)
            except Exception as e:
                print(e)
    
    @staticmethod
    def getNameList()->dict[NickName, CharacterName]:
        """
        キャラ名のリストを返す
        """
        allHumanInformationManager = AllHumanInformationManager.singleton()
        return allHumanInformationManager.nick_names_manager.nickname2Charaname

    @staticmethod
    def setCharName(front_name:str)->CharacterName:
        """
        front_nameからchar_nameに変換する関数
        """
        nickName = NickName(name = front_name)
        name_list = Human.getNameList()
        
        try:
            return name_list[nickName]
        except Exception as e:
            ExtendFunc.ExtendPrint(f"{nickName}は対応するキャラがサーバーに登録されていません。")
            raise e
    
    @staticmethod
    def pickFrontName(filename:str):
        """
        char_nameからfront_nameに変換する関数
        """
        name_list = Human.getNameList()
        for front_name_candidate in name_list.keys():
            if front_name_candidate.name in filename:
                charaName = AllHumanInformationManager.singleton().nick_names_manager.nickname2Charaname[front_name_candidate]
                return charaName
        return "名前が無効です"
    
    @staticmethod
    def checkCommentNameInNameList(atmark_type,comment:str):
        """
        コメントに含まれる名前がキャラ名リストに含まれているか確認する
        """
        name_list = Human.getNameList()
        for nickName in name_list:
            target = f"{atmark_type}{nickName.name}"
            if target in comment:
                return Human.setCharName(nickName.name)
        return "名前が無効です"

    
    @staticmethod
    def convertDictKeyToCharName(dict:dict):
        """
        辞書のキーfront_nameからchar_nameに変換する
        """
        return_dict = {}
        for front_name,value in dict.items():
            return_dict[Human.setCharName(front_name)] = value
        return return_dict

    
    def getHumanImage(self):
        return self.image_data_for_client
    
    def saveHumanImageCombination(self, combination_data:dict, combination_name:str):
        self.human_part.saveHumanImageCombination(combination_data, combination_name,0)

    @staticmethod
    def parseSentenseList(sentense:str)->list[str]:
        """
        文章を分割してリストにする
        """
        sentence_list = re.split('[。、]', sentense)
        # 空白を削除
        sentence_list = list(filter(lambda x: x != "", sentence_list))
        ExtendFunc.ExtendPrint(sentence_list)
        return sentence_list
    
    @staticmethod
    def extractSentence4low(response)->str:
        try:
            data = json.loads(response)
            if "status" in data and "speak" == data["status"] and "spoken_words" in data:
                return data["spoken_words"]
            else:
                return ""
        except json.JSONDecodeError:
            return response.split(":")[-1].split("：")[-1]
        




