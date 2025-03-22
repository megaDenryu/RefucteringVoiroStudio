from pathlib import Path
import win32com.client
import json
from pprint import pprint
import datetime
import psutil
import os
import base64

from api.DataStore.CharacterSetting.CevioAICharacterSettingCollection import CevioAICharacterSettingCollectionOperator
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.Talker2V40.Talker2V40 import Talker2V40
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.TalkerComponentArray2.TalkerComponent2.TalkerComponent2 import TalkerComponent2
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.TalkerComponentArray2.TalkerComponentArray2 import TalkerComponentArray2
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.ExtendSound import ExtendSound
from api.TtsSoftApi.HasTTSState import HasTTSState
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState
from api.gptAI.HumanInfoValueObject import CharacterSaveId
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterModeState, CharacterName, HumanImage, NickName, TTSSoftware, VoiceMode
from api.gptAI.VoiceInfo import WavInfo


class cevio_human(HasTTSState):
    chara_mode_state:CharacterModeState|None
    output_wav_info_list:list[WavInfo]
    @property
    def name(self):
        if self.chara_mode_state is None:
            raise Exception("chara_mode_stateがNoneです")
        return self.chara_mode_state.character_name.name
    @property
    def cevio_name(self):
        if self.chara_mode_state is None:
            return None
            # raise Exception("chara_mode_stateがNoneです")
        name = self.chara_mode_state.voice_mode.mode
        if name == "":
            ExtendFunc.ExtendPrint("キャスト名が空です")
            return None
        return name
    
    _onTTSSoftware:bool = False #CevioAIが起動しているかどうか
    @property
    def onTTSSoftware(self)->bool:
        return self._onTTSSoftware
    _hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #CevioAiがインストールされているかどうか
    @property
    def hasTTSSoftware(self)->TTSSoftwareInstallState:
        return self._hasTTSSoftware
    def __init__(self, chara_mode_state:CharacterModeState|None, started_cevio_num:int) -> None:
        self.chara_mode_state = chara_mode_state
        
        self.cevioStart(started_cevio_num)
        self.output_wav_info_list = []
        if chara_mode_state is not None:
            setting = self.loadVoiceSetting(chara_mode_state.save_id)
            if setting is not None:
                self.setVoiceSetting(setting)
    @staticmethod
    def createAndUpdateALLCharaList(chara_mode_state:CharacterModeState, started_cevio_num:int)->"cevio_human":
        human = cevio_human(chara_mode_state,started_cevio_num)
        human.updateAllCharaList()
        return human
    
    def settingParameter(self,talk_param_dict):
        """
        例:talk_param_dict = {"Volume":50 , "Speed":50 , "Tone":50 , "ToneScale":50 , "Alpha":50 }
        """
        # talk_parameterを設定
        for param, value in talk_param_dict.items():
            if param == "Volume":
                self.talker.Volume = value
            elif param == "Speed":
                self.talker.Speed = value
            elif param == "Tone":
                self.talker.Tone = value
            elif param == "ToneScale":
                self.talker.ToneScale = value
            elif param == "Alpha":
                self.talker.Alpha = value

    def settingEmotion(self,emotion_dict):
        """
        例:emotion_dict = {'嬉しい':0, '普通':100, '怒り':0, '哀しみ':0, '落ち着き':0}
        """
        # 感情設定
        component_array = self.talker.Components
        emotion_list = [component_array.At(i).Name for i in range(component_array.Length)]
        for emotion in emotion_list:
            component_array.ByName(emotion).Value = emotion_dict[emotion]
    def speak(self,content:str):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        sentence_list = content.split("。")
        for text in sentence_list:
            print("cevioで喋ります")
            state = self.talker.Speak(text)
            state.Wait()
    def outputWaveFile(self,content:str, chara_mode_state:CharacterModeState):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        self.chara_mode_state = chara_mode_state
        sentence_list = content.split("。")
        print(sentence_list)
        #output_wav_info_listを初期化
        self.output_wav_info_list = []
        for index,text in enumerate(sentence_list):
            if text == "":
                continue
            else:
                print(f"cevioでwavを生成します:{index + 1}/{len(sentence_list)}")
                #output_wavフォルダがなければ作成
                os.makedirs("output_wav", exist_ok=True)
                wav_path = f"output_wav/cevio_audio_{self.cevio_name}_{index}.wav"
                ExtendFunc.ExtendPrint(wav_path)
                state:bool = self.talker.OutputWaveToFile(text,wav_path)
                phoneme = self.talker.GetPhonemes(text) #音素
                phoneme_str = [[phoneme.at(x).Phoneme,phoneme.at(x).StartTime,phoneme.at(x).EndTime] for x in range(0,phoneme.Length)]
                phoneme_time = [phoneme.at(x).Phoneme for x in range(0,phoneme.Length)]
                wav_data = self.openWavFile(wav_path)   #wabのbinaryデータ
                wav_time = ExtendSound.get_wav_duration(wav_path) #wavの再生時間
                ExtendFunc.ExtendPrintWithTitle(f"{text}のwav_time",wav_time)
                wav_info:WavInfo = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "wav_time":wav_time,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.name,
                    "voice_system_name":"Cevio",
                    "characterModeState": self.chara_mode_state.toDict()
                }
                #pprint(f"{wav_info=}")
                self.output_wav_info_list.append(wav_info)

    def openWavFile(self,file_path):
        """
        wavファイルをバイナリー形式で開き、base64エンコードした文字列を返す
        """
        try:
            # ファイルをバイナリー形式で開く
            with open(file_path,mode="rb") as f:
                binary_data = f.read()
            # ファイル情報をjsonに文字列として入れるためにファイルのバイナリーデータをbase64エンコードする
            base64_data = base64.b64encode(binary_data)
            base64_data_str = base64_data.decode("utf-8")
            return base64_data_str
        except Exception as e:
            return ""
    @staticmethod
    def setCharName(chara:CharacterModeState|None):
        if chara is None:
            return None
        name = chara.character_name.name
        api_dir = Path(__file__).parent.parent
        path = DataDir._().CharSettingJson / "CevioNameForVoiceroidAPI.json"
        with open(path, "r", encoding="utf-8") as f:
            name_list:list[str] = json.load(f)
        #name_dictのキーにnameがあれば、その値を返す。なければ空文字を返す。
        if name in name_list:
            return name
        else:
            return None
        
    def cevioStart(self,started_cevio_num:int):
        print("cevio起動開始")
        if 0 == started_cevio_num:
            #self.kill_cevio()
            pass
        print("cevioが起動しているか確認完了")
        try :
            self.cevio = win32com.client.Dispatch("CeVIO.Talk.RemoteService2.ServiceControl2")
        except:
            print("CeVIOがインストールされていません")
            self._hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            self._onTTSSoftware = False
            return
        
        try:
            print("cevioのインスタンス化完了")
            self.cevio.StartHost(False)
            print("cevio起動完了")
            self.talker = win32com.client.Dispatch("CeVIO.Talk.RemoteService2.Talker2V40")
            print("talkerのインスタンス化完了")
            self.setCast(self.cevio_name)
            print("キャラクターの設定完了")
            self._hasTTSSoftware = TTSSoftwareInstallState.Installed
            self._onTTSSoftware = True
        except:
            print("CeVIOが起動に失敗")
            self._hasTTSSoftware = TTSSoftwareInstallState.Installed
            self._onTTSSoftware = False
            return
    
    def setCast(self,cast_name:str|None):
        if cast_name is not None:
            if cast_name == "":
                ExtendFunc.ExtendPrint("キャスト名が空です")
                return
            self.talker.Cast = cast_name

    def kill_cevio(self):
        for proc in psutil.process_iter():
            try:
                processName = proc.name()
                if 'CeVIO' in processName:
                    target_pid = proc.pid
                    os.kill(target_pid, 9)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
            
    def shutDown(self):
        self.cevio.CloseHost(0)
    def reStart(self):
        print(f"時刻:{datetime.datetime.now()}")
        print("cevio再起動開始")
        #self.shutDown()
        #time.sleep(2)
        self.cevio.StartHost(False)
        self.talker.Cast = self.cevio_name
        #self.cevioStart()
        print("cevio再起動完了")
    
    def getAvailableCast(self)->list[str]:
        """
        利用可能なキャスト一覧を出力

        Returns:
            result (list): 利用可能なキャスト名

        Raises :
          CevioException : CeVIOが起動していない場合の例外
        """
        try:
            castlist = self.talker.AvailableCasts
            result = []
            for i in range(0,castlist.Length):
                result.append(castlist.At(i))
            return result
        except Exception as e:
            print(e)
            raise Exception("CeVIOが起動していません")
    
    def updateAllCharaList(self)->bool:
        """
        CeVIOのキャラクター名を取得して、CevioKnownNames.jsonを更新する

        1. CeVIOのキャラクター名を取得
        2. ボイスモード名リストを更新
        3. キャラクター名リストを更新
        4. キャラクター名からボイスモード名リストを返す辞書    を更新
        5. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
        6. キャラクター名からニックネームリストを返す辞書      を更新
        """
        all_human_info_manager = AllHumanInformationManager.singleton()
        #1. CeVIOのキャラクター名を取得
        cast_list = self.getAvailableCast()
        
        voice_mode_list:list[VoiceMode] = []
        CharacterName_list:list[CharacterName] = []
        chara2voicemode_dict:dict[CharacterName,list[VoiceMode]] = {}
        humanImageFolderName_dict:dict[CharacterName,list[HumanImage]] = {}
        for cast in cast_list:
            voice_mode = VoiceMode(mode = cast, id = None)
            characterName = CharacterName(name = cast)
            voice_mode_list.append(voice_mode)                      #ボイスモード名リストを作成
            CharacterName_list.append(CharacterName(name = cast))   #キャラクター名リストを作成
            chara2voicemode_dict[characterName] = [voice_mode]      #キャラクター名からボイスモード名リストを返す辞書を作成。cevioの場合はボイスモードが一つしかない
            humanImageFolderName_dict[characterName] = []


        # 2. ボイスモード名リストを更新
        all_human_info_manager.voice_mode_names_manager.updateVoiceModeNames(TTSSoftware.CevioAI, voice_mode_list)
        # 3. キャラクター名リストを更新    
        all_human_info_manager.chara_names_manager.updateCharaNames(TTSSoftware.CevioAI, CharacterName_list)
        # 4. キャラクター名からボイスモード名リストを返す辞書    を更新
        all_human_info_manager.CharaNames2VoiceModeDict_manager.updateCharaNames2VoiceModeDict(TTSSoftware.CevioAI, chara2voicemode_dict)
        # 5. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
        all_human_info_manager.human_images.tryAddHumanFolder(CharacterName_list)
        # 6. キャラクター名からニックネームリストを返す辞書      を更新
        all_human_info_manager.nick_names_manager.tryAddCharacterNameKey(CharacterName_list)
        return True
    
    @property
    def talker2V40(self)->Talker2V40:
        return Talker2V40(
            Cast=self.talker.Cast,
            Volume=self.talker.Volume,
            Speed=self.talker.Speed,
            Tone=self.talker.Tone,
            ToneScale=self.talker.ToneScale,
            Alpha=self.talker.Alpha
        )
    
    def loadVoiceSetting(self,saveID:CharacterSaveId)->CevioAIVoiceSettingModel|None:
        """
        ボイス設定を取得する
        """
        charaSettingList = CevioAICharacterSettingCollectionOperator.singleton().getBySaveID(saveID)
        if len(charaSettingList) == 0:
            return None
        voiceSetting = charaSettingList[0].voiceSetting
        return voiceSetting
    
    def setVoiceSetting(self, voiceSetting: CevioAIVoiceSettingModel):
        self.setTalker2V40(voiceSetting.コンディション)
        self.setComponents(voiceSetting.感情)

    def setTalker2V40(self,talker2V40:Talker2V40):
        self.setCast(talker2V40.Cast)
        self.talker.Volume = talker2V40.Volume
        self.talker.Speed = talker2V40.Speed
        self.talker.Tone = talker2V40.Tone
        self.talker.ToneScale = talker2V40.ToneScale
        self.talker.Alpha = talker2V40.Alpha
    
    # 現在のキャストの感情パラメータマップを取得します。
    # 備考：
    # 　内容はCastによって変化します。
    # 　例1『さとうささら』→ "普通", "元気", "怒り", "哀しみ"
    # 　例2『小春六花』→ "嬉しい", "普通", "怒り", "哀しみ", "落ち着き"
    @property
    def Components(self)->TalkerComponentArray2:
        components = {}
        for i in range(0,self.talker.Components.Length):
            t = self.talker.Components.At(i)
            components[t.Name] = t.Value
            # component = TalkerComponent2(
            #     Id=t.Id,
            #     Name=t.Name,
            #     Value=t.Value
            # )
        return TalkerComponentArray2(record=components)

    
    def setComponents(self,components:TalkerComponentArray2):
        for name in components.record:
            self.talker.Components.ByName(name).Value = components.record[name]
            # self.talker.Components.ByName(component.Name).Value = component.Value
    
    def ComponentByName(self,name:str)->TalkerComponent2:
        t = self.talker.Components.ByName(name)
        return TalkerComponent2(
            Id=t.Id,
            Name=t.Name,
            Value=t.Value
        )
    
    def ComponentAt(self,index:int)->TalkerComponent2:
        t = self.talker.Components.At(index)
        return TalkerComponent2(
            Id=t.Id,
            Name=t.Name,
            Value=t.Value
        )
        