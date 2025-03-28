
from pydantic import InstanceOf
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.RubiConverter.AIRubiConverter import AIRubiConverter
from api.LLM.エージェント.RubiConverter.RubiConverterUnitDictFactory import AIRubiConverterFactory
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.I会話履歴 import I会話履歴
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBody import LLMHumanBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.LLMHumanBodyInput import LLMHumanBodyInput
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.表現したいこと import PresentationByBody
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I体を持つ者 import I体を持つ者
from api.TtsSoftApi.AIVoice.AIVoiceHuman import AIVoiceHuman
from api.TtsSoftApi.AIVoice.AIVoiceHumanNoDisplay import AIVoiceHumanNoDisplay
from api.TtsSoftApi.CevioAI.CevioAIHumanNoDisplay import CevioAIHumanNoDisplay
from api.TtsSoftApi.Coeiroink.CoeiroinkHuman import Coeiroink
from api.TtsSoftApi.Coeiroink.CoeiroinkHumanNoDisplay import CoeiroinkHumanNoDisplay
from api.TtsSoftApi.VoiceSystemType import VoiceSystem
from api.TtsSoftApi.VoiceVox.VoiceVoxHuman import VoiceVoxHuman
from api.TtsSoftApi.VoiceVox.VoiceVoxHumanNoDisplay import VoiceVoxHumanNoDisplay
from api.gptAI.CharacterModeStateForNoDisplay import CharacterModeStateForNoDisplay
from api.gptAI.HumanInfoValueObject import TTSSoftware
from api.gptAI.Human自分の情報コンテナ import Human自分の情報コンテナ
from api.gptAI.Human自分の情報コンテナForNoDisplay import Human自分の情報コンテナForNoDisplay
from api.gptAI.IHuman import IHuman
from api.gptAI.VoiceInfo import WavInfo, WavInfoForNoDisplay


class HumanNoDisplay(IHuman,I体を持つ者):
    voice_switch = True # debug用の変数
    chara_mode_state:CharacterModeStateForNoDisplay
    voice_system:VoiceSystem
    aiRubiConverter:AIRubiConverter
    _llmHumanBody: LLMHumanBody
    _会話履歴: I会話履歴|None = None
    _llmHumanBodyInput: LLMHumanBodyInput
    _human自分の情報コンテナ:Human自分の情報コンテナForNoDisplay
    @property
    def char_name(self): #キャラ名
        return self.chara_mode_state.character_name
    @property
    def id(self):
        return self.chara_mode_state.id
    def __init__(self,chara_mode_state:CharacterModeStateForNoDisplay ,voiceroid_dict) -> None:
        """
        @param voiceroid_dict: 使用してる合成音声の種類をカウントする辞書。{"cevio":0,"voicevox":0,"AIVOICE":0}。cevioやAIVOICEの起動管理に使用。
        """
        # 以下コンストラクタのメイン処理
        self.chara_mode_state = chara_mode_state
        self.voice_system = self.start(voiceroid_dict)
        self.aiRubiConverter = AIRubiConverterFactory.create()
        self._human自分の情報コンテナ = Human自分の情報コンテナForNoDisplay(self.chara_mode_state)
    
    def start(self, voiceroid_dict:dict[str,int] = {"cevio":0,"voicevox":0,"AIVOICE":0,"Coeiroink":0})->VoiceSystem:#voiceroid_dictはcevio,voicevox,AIVOICEの数をカウントする
        if self.voice_switch:
            if TTSSoftware.CevioAI.equal(self.chara_mode_state.tts_software):
                tmp_cevio = CevioAIHumanNoDisplay.createAndUpdateALLCharaList(self.chara_mode_state,voiceroid_dict["cevio"])
                print(f"{self.char_name}のcevio起動開始")
                self.human_Voice = tmp_cevio
                print(f"{self.char_name}のcevio起動完了")
                self.human_Voice.speak("起動完了")
                return "cevio"
            elif TTSSoftware.VoiceVox.equal(self.chara_mode_state.tts_software):
                tmp_voicevox = VoiceVoxHumanNoDisplay(self.chara_mode_state,voiceroid_dict["voicevox"])
                print(f"{self.char_name}のvoicevox起動開始")
                self.human_Voice = tmp_voicevox
                print(f"{self.char_name}のvoicevox起動完了")
                self.human_Voice.speak("起動完了")
                return "voicevox"
            elif TTSSoftware.AIVoice.equal(self.chara_mode_state.tts_software):
                tmp_aivoice = AIVoiceHumanNoDisplay.createAndUpdateALLCharaList(self.chara_mode_state, voiceroid_dict["AIVOICE"])
                print(f"{self.char_name}のAIVOICE起動開始")
                self.human_Voice = tmp_aivoice
                print(f"{self.char_name}のAIVOICE起動完了")
                self.human_Voice.speak("起動完了")
                return "AIVOICE"
            elif TTSSoftware.Coeiroink.equal(self.chara_mode_state.tts_software):
                tmp_coeiroink = CoeiroinkHumanNoDisplay(self.chara_mode_state, voiceroid_dict["Coeiroink"])
                print(f"{self.char_name}のcoeiroink起動開始")
                self.human_Voice = tmp_coeiroink
                print(f"{self.char_name}のcoeiroink起動完了")
                return "Coeiroink"
            else:
                return "ボイロにいない名前が入力されたので起動に失敗しました。"
        else:
            print(f"ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。")
            return "ボイロ起動しない設定なので起動しません。ONにするにはHuman.voice_switchをTrueにしてください。"

    def outputWaveFile(self,str:str)->list[WavInfoForNoDisplay]|None:
        str = str.replace(" ","").replace("　","")
        # str = TextConverter.convertReadableJapanaeseSentense(str)
        if isinstance(self.human_Voice, CevioAIHumanNoDisplay):
            print("cevioでwav出力します")
            return self.human_Voice.outputWaveFile(str)
        elif isinstance(self.human_Voice, AIVoiceHumanNoDisplay):
            print("AIvoiceでwav出力します")
            return self.human_Voice.outputWaveFile(str)
        elif isinstance(self.human_Voice, VoiceVoxHumanNoDisplay):
            print("voicevoxでwav出力します")
            return self.human_Voice.outputWaveFile(str)
        elif isinstance(self.human_Voice, CoeiroinkHumanNoDisplay):
            print("coeiroinkでwav出力します")
            return self.human_Voice.outputWaveFile(str)
        else:
            print("wav出力できるボイロが起動してないのでwav出力できませんでした。")
            return None
    
    # I体を持つ者のメソッド
    @property
    def llmHumanBody(self)->LLMHumanBody:
        return self.llmHumanBody

    @property
    def llmHumanBodyInput(self)->LLMHumanBodyInput:
        return self.llmHumanBodyInput
    
    @property
    def 自分の情報(self)->Human自分の情報コンテナForNoDisplay:
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