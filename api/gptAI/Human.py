import re
from typing import Literal

from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.RubiConverter.AIRubiConverter import AIRubiConverter
from api.LLM.エージェント.RubiConverter.RubiConverterUnitDictFactory import AIRubiConverterFactory
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBody import LLMHumanBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者
from api.TtsSoftApi.Coeiroink.CoeiroinkHuman import Coeiroink
from api.TtsSoftApi.VoiceVox.VoiceVoxHuman import VoiceVoxHuman
from api.gptAI.Human自分の情報コンテナ import Human自分の情報コンテナ
from api.gptAI.HumanInformation import CharacterModeState, TTSSoftware
from api.gptAI.VoiceInfo import WavInfo
from api.images.image_manager.HumanPart import HumanPart
from api.images.image_manager.IHumanPart import HumanData, AllBodyFileInfo


try:
    from api.TtsSoftApi.voiceroid_api import cevio_human
except ImportError:
    cevio_human = None
    print("cevio_human module could not be imported. Please ensure the required application is installed.")

try:
    from api.TtsSoftApi.voiceroid_api import AIVoiceHuman
except ImportError:
    AIVoiceHuman = None
    print("AIVoiceHuman module could not be imported. Please ensure the required application is installed.")

VoiceSystem = Literal["cevio","voicevox","AIVOICE","Coeiroink","ボイロにいない名前が入力されたので起動に失敗しました。","ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。"]
class Human(I体を持つ者):
    voice_switch = True # debug用の変数
    chara_mode_state:CharacterModeState
    _image_data_for_client:HumanData
    _body_parts_pathes_for_gpt:AllBodyFileInfo
    human_part:HumanPart
    voice_system:VoiceSystem
    aiRubiConverter:AIRubiConverter
    _llmHumanBody: LLMHumanBody
    _会話履歴: I会話履歴|None
    _llmHumanBodyInput: LLMHumanBodyInput
    _human自分の情報コンテナ:Human自分の情報コンテナ
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
        self._image_data_for_client,self._body_parts_pathes_for_gpt = self.human_part.getHumanAllParts(self.char_name, self.front_name, human_image)
        self.voice_system = self.start(voiceroid_dict)
        self.aiRubiConverter = AIRubiConverterFactory.create()
        self._human自分の情報コンテナ = Human自分の情報コンテナ()
    
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
                tmp_voicevox = VoiceVoxHuman(self.chara_mode_state,voiceroid_dict["voicevox"])
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

    def outputWaveFile(self,str:str)->list[WavInfo]|None:
        str = str.replace(" ","").replace("　","")
        # str = TextConverter.convertReadableJapanaeseSentense(str)
        if cevio_human == type(self.human_Voice):
            print("cevioでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif AIVoiceHuman == type(self.human_Voice):
            print("AIvoiceでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif VoiceVoxHuman == type(self.human_Voice):
            print("voicevoxでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        elif Coeiroink == type(self.human_Voice):
            print("coeiroinkでwav出力します")
            self.human_Voice.outputWaveFile(str, self.chara_mode_state)
        else:
            print("wav出力できるボイロが起動してないのでwav出力できませんでした。")
            return None
        return self.human_Voice.output_wav_info_list
    
    def getHumanImage(self):
        return self._image_data_for_client
    
    def saveHumanImageCombination(self, combination_data:dict, combination_name:str):
        self.human_part.saveHumanImageCombination(combination_data, combination_name,0)
    
    # I体を持つ者のメソッド
    @property
    def llmHumanBody(self)->LLMHumanBody:
        return self.llmHumanBody

    @property
    def llmHumanBodyInput(self)->LLMHumanBodyInput:
        return self.llmHumanBodyInput
    
    @property
    def 自分の情報(self)->Human自分の情報コンテナ:
        return self._human自分の情報コンテナ
    
    def 会話履歴注入(self, 会話履歴: I会話履歴):
        if self._会話履歴 is not None:
            return
        self._会話履歴 = 会話履歴
        self._llmHumanBodyInput = {"会話履歴": self._会話履歴,"表現機構": self, "自分の情報": self.自分の情報}
        self._llmHumanBody = LLMHumanBody(input=self._llmHumanBodyInput)
        self._会話履歴.addOnMessage(self._llmHumanBody.イベント反応メインプロセス)

    def 表現する(self, 表現したいこと:PresentationByBody):
        ExtendFunc.ExtendPrint(表現したいこと)
    
    def しゃべる(self, message:str):
        ExtendFunc.ExtendPrint(message)

    




