import re
from typing import Literal

from api.Extend.ExtendFunc import ExtendFunc, TextConverter
from api.LLM.RubiConverter.ConverterUnits.ChatGPTRubiConverterUnit import ChatGPTRubiConverterUnit
from api.gptAI.HumanInfoValueObject import CharacterName, NickName
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterModeState, TTSSoftware
from api.images.image_manager.IHumanPart import HumanData, AllBodyFileInfo
from api.gptAI.HumanInformation import CharacterId
from .voiceroid_api import voicevox_human
from .voiceroid_api import Coeiroink

from ..images.image_manager.HumanPart import HumanPart

try:
    from .voiceroid_api import cevio_human
except ImportError:
    cevio_human = None
    print("cevio_human module could not be imported. Please ensure the required application is installed.")

try:
    from .voiceroid_api import AIVoiceHuman
except ImportError:
    AIVoiceHuman = None
    print("AIVoiceHuman module could not be imported. Please ensure the required application is installed.")

VoiceSystem = Literal["cevio","voicevox","AIVOICE","Coeiroink","ボイロにいない名前が入力されたので起動に失敗しました。","ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。"]
class Human:
    voice_switch = True # debug用の変数
    chara_mode_state:CharacterModeState
    image_data_for_client:HumanData
    body_parts_pathes_for_gpt:AllBodyFileInfo
    human_part:HumanPart
    voice_system:VoiceSystem
    aiRubiConverter:ChatGPTRubiConverterUnit
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
        @param voiceroid_dict: 使用してる合成音声の種類をカウントする辞書。{"cevio":0,"voicevox":0,"AIVOICE":0}。cevioやAIVOICEの起動管理に使用。
        """
        # 以下コンストラクタのメイン処理
        self.chara_mode_state = chara_mode_state
        # 体画像周りを準備する
        self.human_part = HumanPart(self.chara_mode_state.character_name, self.chara_mode_state.human_image)
        human_image = chara_mode_state.human_image
        self.image_data_for_client,self.body_parts_pathes_for_gpt = self.human_part.getHumanAllParts(self.char_name, self.front_name, human_image)
        self.voice_system:VoiceSystem = self.start(voiceroid_dict)
        self.aiRubiConverter = ChatGPTRubiConverterUnit()
    
    def start(self, voiceroid_dict:dict[str,int] = {"cevio":0,"voicevox":0,"AIVOICE":0,"Coeiroink":0})->VoiceSystem:#voiceroid_dictはcevio,voicevox,AIVOICEの数をカウントする
        if self.voice_switch:
            if TTSSoftware.CevioAI.equal(self.chara_mode_state.tts_software):
                if cevio_human is None:
                    raise ImportError("cevio_human module is not available.")
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
                if AIVoiceHuman is None:
                    raise ImportError("AIVoiceHuman module is not available.")
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




