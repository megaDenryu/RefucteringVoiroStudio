from enum import Enum
from pathlib import Path
import win32com.client
import time
import requests
import pyaudio
import json
from pprint import pprint
import datetime
import psutil
import os
import base64

#AI.VOICE Editor API用のライブラリ
import clr
from typing import Dict, Any, Literal, TypedDict, Protocol
from pydantic import BaseModel
from typing import Optional

import sys
from api.Extend.ExtendFunc import ExtendFunc
from api.DataStore.JsonAccessor import JsonAccessor
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterName, HumanImage, NickName, TTSSoftware, VoiceMode

import subprocess
import winreg



class TTSSoftwareInstallState(Enum):
    NotInstalled = 0
    Installed = 1
    ModuleNotFound = 2

class cevio_human:
    name:str|None = None
    cevio_name:str|None = None
    onTTSSoftware:bool = False #CevioAIが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #CevioAiがインストールされているかどうか
    def __init__(self,char_name:str|None,started_cevio_num:int) -> None:
        if char_name is not None:
            self.name = char_name 
            self.cevio_name = self.setCharName(char_name)
        
        self.cevioStart(started_cevio_num)
        self.output_wav_info_list = []

    @staticmethod
    def createAndUpdateALLCharaList(char_name:str|None,started_cevio_num:int)->"cevio_human":
        human = cevio_human(char_name,started_cevio_num)
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
    def outputWaveFile(self,content:str):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
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
                state:bool = self.talker.OutputWaveToFile(text,wav_path)
                phoneme = self.talker.GetPhonemes(text) #音素
                phoneme_str = [[phoneme.at(x).Phoneme,phoneme.at(x).StartTime,phoneme.at(x).EndTime] for x in range(0,phoneme.Length)]
                phoneme_time = [phoneme.at(x).Phoneme for x in range(0,phoneme.Length)]
                wav_data = self.openWavFile(wav_path)   #wabのbinaryデータ
                wav_info = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.name,
                    "cevio_name":self.cevio_name,
                    "voice_system_name":"Cevio"
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
    def setCharName(name:str|None):
        if name is None:
            return None
        api_dir = Path(__file__).parent.parent
        path = api_dir / "CharSettingJson" / "CevioNameForVoiceroidAPI.json"
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
            self.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            self.onTTSSoftware = False
            return
        
        try:
            print("cevioのインスタンス化完了")
            self.cevio.StartHost(False)
            print("cevio起動完了")
            self.talker = win32com.client.Dispatch("CeVIO.Talk.RemoteService2.Talker2V40")
            print("talkerのインスタンス化完了")
            self.setCast(self.cevio_name)
            print("キャラクターの設定完了")
            self.hasTTSSoftware = TTSSoftwareInstallState.Installed
            self.onTTSSoftware = True
        except:
            print("CeVIOが起動に失敗")
            self.hasTTSSoftware = TTSSoftwareInstallState.Installed
            self.onTTSSoftware = False
            return
    
    def setCast(self,cast_name:str|None):
        if cast_name is not None:
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
        self.talker.Cast = self.setCharName(self.name)
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
    
    def updateAllCharaList(self):
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
        

class SpeakerStyle(TypedDict):
    id:int
    name:str
    type:Literal["talk"]
class SpeakerInfo(TypedDict):
    name:str
    styles:list[SpeakerStyle]
class voicevox_human:
    name:str|None = None
    onTTSSoftware:bool = False #voicevoxが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #voicevoxがインストールされているかどうか
    def __init__(self,name:str|None,started_voicevox_num:int) -> None:
        if name is None:
            return
        if started_voicevox_num == 0:
            self.start()
        
        if "" != self.getCharNum(name):
            self.char_num = self.getCharNum(name)
            self.query_url = f"http://127.0.0.1:50021/audio_query" #f"http://localhost:50021/audio_query"だとlocalhostの名前解決に時間がかかるらしい
            self.synthesis_url = f"http://127.0.0.1:50021/synthesis" #f"http://localhost:50021/synthesis"だとlocalhostの名前解決に時間がかかるらしい
            self.char_name = name
        else:
            self.char_name = ""
            self.name = ""
    
    def start(self):
        voicevox_human.createVoiceVoxNameToNumberDict() #キャラアプデ処理旧
        self.updateAllCharaList() #キャラアプデ処理新
    
    @staticmethod
    def getCharNum(name):
        """
        VOICEVOXとの通信で使う名前。
        front_nameとchar_nameのようなgptや画像管理で使うための名前ではない。
        """

        api_dir = Path(__file__).parent.parent
        path = api_dir / "CharSettingJson" / "VoiceVoxNameToNumber.json"
        with open(path, "r", encoding="utf-8") as f:
            name_dict = json.load(f)
        #name_listのキーにnameがあれば、その値を返す。なければ空文字を返す。
        if name in name_dict:
            return name_dict[name]
        else:
            return ""

    def getVoiceQuery(self, text: str) -> Dict[str, Any]:
        params = {
            'speaker': self.char_num,
            'text': text
        }
        pprint(params)
        query_dict:Dict[str, Any] = requests.post(self.query_url, params=params).json()
        return query_dict
    
    
    def getVoiceWav(self,query_dict:Dict[str, Any]):
        """
        getVoiceQuery()で取得したquery_dictを引数に使ってwavを生成する.
        """
        query_json = json.dumps(query_dict)
        wav = requests.post(self.synthesis_url, params={'speaker': self.char_num}, data=query_json)
        return wav
    
    def wav2base64(self,wav):
        binary_data = wav.content
        base64_data = base64.b64encode(binary_data)
        base64_data_str = base64_data.decode("utf-8")
        return base64_data_str

    def getLabData(self,query_dict:Dict[str,Any], pitchScale = None, speedScale = None, intonationScale = None):
        """
        参考URL:https://qiita.com/hajime_y/items/7a5b3be2eec561a6117d
        getVoiceQuery()で取得したquery_dictを引数に使ってlabdataを生成する.
        """
        if pitchScale is not None:
            query_dict["pitchScale"] = pitchScale
        if speedScale is not None:
            query_dict["speedScale"] = speedScale
        if intonationScale is not None:
            query_dict["intonationScale"] = intonationScale

        labdata=""
        phonome_str = []
        phonome_time = []
        now_length=0
        timescale = 10000000/float(query_dict["speedScale"])
        for phrase in query_dict["accent_phrases"]:
            for mora in phrase["moras"]:
                #moraの中には子音の情報と母音の情報が両方ある。子音はない場合もある。
                # 子音がある場合
                if mora["consonant_length"] is not None:
                    #labdata += str(int(now_length*timescale)) + " "
                    start = int(now_length*timescale) / 10000000
                    now_length += mora["consonant_length"]
                    #labdata += str(int(now_length*timescale)) + " " + mora["consonant"] + "\n"
                    end = int(now_length*timescale) / 10000000
                    phonome_str.append([mora["consonant"],start,end])
                    phonome_time.append(mora["consonant"])
                # 母音
                #labdata += str(int(now_length*timescale)) + " "
                start = int(now_length*timescale) / 10000000
                now_length += mora["vowel_length"]
                #labdata += str(int(now_length*timescale)) + " " + mora["vowel"] + "\n"
                end = int(now_length*timescale) / 10000000
                phonome_str.append([mora["vowel"],start,end])
                phonome_time.append(mora["vowel"])
            if phrase["pause_mora"] is not None:
                # ポーズの場合
                #labdata += str(int(now_length*timescale)) + " "
                start = int(now_length*timescale) / 10000000
                now_length += phrase["pause_mora"]["vowel_length"]
                #labdata += str(int(now_length*timescale)) + " " + "pau\n"
                end = int(now_length*timescale) / 10000000
                phonome_str.append(["pau",start,end])
                phonome_time.append("pau")
        return phonome_str,phonome_time#labdata
    
    def speak(self,text):
        query:Dict[str, Any] = self.getVoiceQuery(text)
        pprint(query)
        phonome_str,phonome_time = self.getLabData(query)
        pprint(phonome_str)
        wav = self.getVoiceWav(query)
        print(text)
        self.playWav_pyaudio(wav)
        #self.saveWav(wav)
        print("終わり")

    def saveWav(self,response_wav):
        with open("audio.wav", "wb") as f:
            f.write(response_wav.content)
    def playWav_pyaudio(self,response_wav):
        p = pyaudio.PyAudio()
        stream =  p.open(format=pyaudio.paInt16,
                         channels=1,
                         rate=24000,
                         output=True)
        stream.write(response_wav.content)

        stream.stop_stream()
        stream.close()

        p.terminate()
    
    def outputWaveFile(self,content:str):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        sentence_list = content.split("。")
        print(sentence_list)
        #output_wav_info_listを初期化
        self.output_wav_info_list = []
        for index,text in enumerate(sentence_list):
            if text == "":
                continue
            else:
                #output_wavフォルダがなければ作成
                os.makedirs("output_wav", exist_ok=True)
                print(f"voicevoxでwavを生成します:{index + 1}/{len(sentence_list)}")
                wav_path = f"output_wav/voicevox_audio_{self.char_name}_{index}.wav"
                query:Dict[str, Any] = self.getVoiceQuery(text)
                print("query取得完了")
                phoneme_str,phoneme_time = self.getLabData(query)
                print("lab_data取得完了")
                wav_data = self.wav2base64(self.getVoiceWav(query))
                print("wav_data取得完了")

                wav_info = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.char_name,
                    "voice_system_name":"VoiceVox"
                }
                self.output_wav_info_list.append(wav_info)



    @staticmethod
    def getSpeakerDict()->list[SpeakerInfo]:
        url = "http://localhost:50021/speakers"
        headers = {'accept': 'application/json'}
        response = requests.get(url, headers=headers)
        speaker_dict = response.json()
        return speaker_dict
    
    def updateAllCharaList(self):
        voicevox_human.updateAllCharaListStatic()
        
    
    @staticmethod
    def updateAllCharaListStatic():
        """
        1. VoiceVoxのキャラクター名を取得
        2. キャラクター名リストを更新
        3. キャラクター名からボイスモード名リストを返す辞書    を更新
        4. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
        5. キャラクター名からニックネームリストを返す辞書      を更新
        """
        try:
            #1. VoiceVoxのキャラクター名を取得
            speaker_dict = voicevox_human.getSpeakerDict()
            #2. キャラクター名リストを更新
            voicevox_human.updateCharaNames(speaker_dict)
            #3. キャラクター名からボイスモード名リストを返す辞書    を更新
            voicevox_human.updateVoiceModeInfo(speaker_dict)
            #4. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
            voicevox_human.upadteNicknameAndHumanImagesFolder(speaker_dict)
        except Exception as e:
            print(e)
            print("VoiceVoxのキャラクター名取得に失敗しました。起動してないかもしれません")
        
    @staticmethod
    def updateCharaNames(speaker_dict:list[SpeakerInfo]):
        all_human_info_manager = AllHumanInformationManager.singleton()
        speaker_list:list[CharacterName] = []
        for speaker in speaker_dict:
            name = speaker["name"]
            speaker_list.append(CharacterName(name = name))
        
        all_human_info_manager.chara_names_manager.updateCharaNames(TTSSoftware.VoiceVox,speaker_list)
    
    @staticmethod
    def updateVoiceModeInfo(speaker_dict:list[SpeakerInfo]):
        all_human_info_manager = AllHumanInformationManager.singleton()
        voicemode_dict:dict[CharacterName,list[VoiceMode]] = {}
        for speaker in speaker_dict:
            name = speaker["name"]
            styles = speaker["styles"]
            voice_mode_list = []
            for style in styles:
                style_name = style["name"]
                style_num = style["id"]
                voice_mode = VoiceMode(mode = style_name, id = style_num)
                voice_mode_list.append(voice_mode)
            voicemode_dict[CharacterName(name = name)] = voice_mode_list
            
        all_human_info_manager.CharaNames2VoiceModeDict_manager.updateCharaNames2VoiceModeDict(TTSSoftware.VoiceVox,voicemode_dict)

    @staticmethod
    def upadteNicknameAndHumanImagesFolder(speaker_dict:list[SpeakerInfo]):
        """
        ニックネームリストと立ち絵のフォルダ名リストに新しいキャラがいれば追加する
        """
        all_human_info_manager = AllHumanInformationManager.singleton()
        tmp_charaNames:list[CharacterName] = []
        for speaker in speaker_dict:
            name = speaker["name"]
            tmp_charaNames.append(CharacterName(name = name))
        all_human_info_manager.nick_names_manager.tryAddCharacterNameKey(tmp_charaNames)
        all_human_info_manager.human_images.tryAddHumanFolder(tmp_charaNames)

    
    @staticmethod
    def createVoiceVoxNameToNumberDict():
        """
        まず
        curl -X 'GET' \
        'http://localhost:50021/speakers' \
        -H 'accept: application/json'
        を実行して、VOICEVOXのキャラクター名とキャラクター番号のjsonを取得する。
        次にVOICEVOXのキャラクター名とキャラクター番号の対応表を作成する。
        """

        speaker_dict = voicevox_human.getSpeakerDict()
        save_dict = {}
        for speaker in speaker_dict:
            name = speaker["name"]
            styles = speaker["styles"]
            for style in styles:
                style_name = style["name"]
                style_num = style["id"]
                save_name = name + ":" +style_name
                save_dict[save_name] = style_num
        pprint(save_dict)
        api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        path = api_dir / "CharSettingJson" / "VoiceVoxNameToNumber.json"
        #pathにspeaker_dictを書き込む
        with open(path, "w", encoding="utf-8") as f:
            json.dump(save_dict,f,ensure_ascii=False, indent=4)

    @staticmethod
    def find_voicevox_path():
        try:
            # レジストリキーを開く
            reg_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\VOICEVOX")
            # インストールパスを取得
            voicevox_path, _ = winreg.QueryValueEx(reg_key, "InstallPath")
            winreg.CloseKey(reg_key)
            return voicevox_path
        except FileNotFoundError:
            return None

    @staticmethod
    def startVoicevox()->"voicevox_human":
        tmp_human = voicevox_human(None,0)
        voicevox_path = voicevox_human.find_voicevox_path()
        if voicevox_path is None:
            # 既知のパスをチェック
            known_paths = [
                "C://Program Files//VOICEVOX//"
            ]
            for path in known_paths:
                if os.path.exists(path):
                    voicevox_path = path
                    break

        if voicevox_path is None:
            print("VoiceVoxのインストール場所が見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human

        voicevox_exe_path = os.path.join(voicevox_path, "VOICEVOX.exe")
        if not os.path.exists(voicevox_exe_path):
            print("VoiceVoxのexeファイルが見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human

        try:
            # 非同期でプロセスを起動
            subprocess.Popen([voicevox_exe_path])
            print("VoiceVoxが正常に起動しました。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            return tmp_human
        except Exception as e:
            print(f"VoiceVoxの起動に失敗しました: {e}")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = False
            return tmp_human
        



class StyleModel(BaseModel):
    Name: str  # J, A, S
    Value: float

class MergedVoiceModel(BaseModel):
    VoiceName: str

class MergedVoiceContainerModel(BaseModel):
    BasePitchVoiceName: str
    MergedVoices: list[MergedVoiceModel]

class VoicePresetModel(BaseModel):
    """
    AIVoiceEditorのVoicePresetModelをpydanticで定義.
    https://aivoice.jp/manual/editor/API/html/ace2be3b-ee08-3dda-405c-8967e31385cf.htm
    """
    PresetName: str
    VoiceName: str
    Volume: float
    Speed: float
    Pitch: float
    PitchRange: float
    MiddlePause: int
    LongPause: int
    Styles: list[StyleModel]
    MergedVoiceContainer: Optional[MergedVoiceContainerModel]



class AIVoiceHuman:
    aivoice_name:str|None = None
    onTTSSoftware:bool = False #AIVoiceが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #AIVoiceがインストールされているかどうか
    def __init__(self,char_name:str|None,started_AIVoice_num:int) -> None:
        if char_name is not None:
            self.char_name = char_name
            self.aivoice_name = self.setCharName(char_name)
        self.start()
    
    @staticmethod
    def createAndUpdateALLCharaList(char_name:str|None,started_AIVoice_num:int)->"AIVoiceHuman":
        human = AIVoiceHuman(char_name,started_AIVoice_num)
        print(human.updateCharName())
        human.updateAllCharaList()
        return human


        
    def start(self):
        _editor_dir = os.environ['ProgramW6432'] + '\\AI\\AIVoice\\AIVoiceEditor\\'

        # 自分で置かないといけないファイルがあるか確認dllを確認。todo ダウンロードと配置を自動化する
        if not os.path.isfile(_editor_dir + 'AI.Talk.Editor.Api.dll'):
            print("A.I.VOICE Editor (v1.3.0以降) がインストールされていません。")
            self.hasTTSSoftware = TTSSoftwareInstallState.ModuleNotFound
            self.onTTSSoftware = False
            return
        # A.I.VOICE Editor APIの読み込み
        try:
            # pythonnet DLLの読み込み
            clr.AddReference(_editor_dir + "AI.Talk.Editor.Api")
            from AI.Talk.Editor.Api import TtsControl, HostStatus
        
        except Exception as e:
            print(f"AI.Talk.Editor.Api.dllの読み込みに失敗しました: {e}")
            self.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            self.onTTSSoftware = False
            return        

        # アクセスを確立する
        try:
            self.tts_control = TtsControl()

            # A.I.VOICE Editor APIの初期化
            host_name = self.tts_control.GetAvailableHostNames()[0]
            self.tts_control.Initialize(host_name)

            # A.I.VOICE Editorの起動
            if self.tts_control.Status == HostStatus.NotRunning:
                self.tts_control.StartHost()

            # A.I.VOICE Editorへ接続
            self.tts_control.Connect()
            host_version = self.tts_control.Version
            self.setVoiceChara()
            print(f"{host_name} (v{host_version}) へ接続しました。")
            self.hasTTSSoftware = TTSSoftwareInstallState.Installed
            self.onTTSSoftware = True
        except Exception as e:
            print(f"A.I.VOICE Editorへの接続に失敗しました: {e}")
            self.hasTTSSoftware = TTSSoftwareInstallState.Installed
            self.onTTSSoftware = False
            return

    def outputWaveFile(self,content:str):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        sentence_list = content.split("。")
        print(sentence_list)
        #output_wav_info_listを初期化
        self.output_wav_info_list = []
        for index,text in enumerate(sentence_list):
            if text == "":
                continue
            else:
                print(f"AIVoiceでwavを生成します:{index + 1}/{len(sentence_list)}")
                wav_path = f"output_aivoice/aivoice_audio_{self.aivoice_name}_{index}"

                #tts_controlには毎回キャラクターを設定
                try:
                    self.setVoiceChara()
                except Exception as e:
                    #AIVoiceとの接続が切断されてるときがあるので、再接続する
                    print("キャラクターの設定に失敗しました")
                    print(e)
                    self.start()
                    self.setVoiceChara()
                # テキストを設定
                self.tts_control.Text = text

                # 音声、lab、を保存
                self.tts_control.SaveAudioToFile(f"{wav_path}.wav")



                # 送信するデータを作成する
                phoneme_str, phoneme_time = self.getPhonemes(f"{wav_path}.lab")
                wav_data = self.openWavFile(f"{wav_path}.wav")   #wabのbinaryデータ
                wav_info = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.char_name,
                    "aivoice_name":self.aivoice_name,
                    "voice_system_name":"AIVoice"
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
    def getPhonemes(self,file_path)->tuple[list[list[str]],list[str]]:
        # 空のリストを作成
        phoneme_str:list[list[str]] = []
        phoneme_time:list[str] = [] 
        # ファイルを開く
        with open(file_path, 'r') as file:
            # 各行を読み込む
            for line in file:
                # 行をスペースで分割
                split_line = line.strip().split()
                format_split_line = [split_line[2],int(split_line[0]) / (10**7),int(split_line[1]) / (10**7)]
                time = split_line[2]
                # 結果をリストに追加
                phoneme_str.append(format_split_line)
                phoneme_time.append(time)

        return phoneme_str,phoneme_time
    
    def setVoiceChara(self):
        #ボイスを琴葉 葵に設定する
        if self.aivoice_name is not None:
            return
        self.tts_control.CurrentVoicePresetName=self.aivoice_name
    
    def convertPythonList(self,CsArr):
        list = []
        for i in CsArr:
            list.append(i)
        return list
    
    @staticmethod
    def setCharName(name:str)->str:
        """
        AIVOICEとの通信で使う名前。
        front_nameとchar_nameのようなgptや画像管理で使うための名前ではない。
        """

        path = ExtendFunc.createTargetFilePathFromCommonRoot(__file__, "api/CharSettingJson/AIVOICENameForVoiceroidAPI.json")
        name_dict:dict[str,str] = ExtendFunc.loadJsonToDict(path)
        #name_listのキーにnameがあれば、その値を返す。なければ空文字を返す。
        if name in name_dict:
            return name_dict[name]
        else:
            return ""
        
    @property
    def VoiceNames(self)->list[str]:
        if self.tts_control is None:
            raise Exception("AIVoiceEditorが起動していません")
        voiceNames = self.convertPythonList(self.tts_control.VoiceNames) #利用可能なキャラクター名一覧を取得
        #[ '琴葉 茜', '琴葉 茜（蕾）', '琴葉 葵', '琴葉 葵（蕾）' ]
        return voiceNames
    
    @property
    def CharaNames(self)->list[CharacterName]:
        """
        茜ちゃんなら蕾などのサブ名前を取り除いて、キャラ名だけを取得し、重複を取り除いてリストにする。ボイスモード辞書などのキーに使えるものと同じ。
        @return : [CharacterName(name='琴葉茜'), CharacterName(name='紲星あかり'), CharacterName(name='琴葉葵'), CharacterName(name='結月ゆかり')]
        """
        charaNames = []
        for name in self.VoiceNames:
            chara_name = AIVoiceHuman.convertAIVoiceName2CharaName(name)
            #既にリストに入っていないなら追加
            if chara_name not in charaNames:
                charaNames.append(chara_name)
        return charaNames
    
    @property
    def CharaNames2DefalutVoiceModeDict(self)->dict[CharacterName, list[VoiceMode]]:
        chara2voicemode_dict:dict[CharacterName, list[VoiceMode]] = {}
        for name in self.VoiceNames:
            charaName = AIVoiceHuman.convertAIVoiceName2CharaName(name)
            voiceMode = VoiceMode(mode = name, id_str = self.GetVoicePreset(name).VoiceName)
            if charaName in chara2voicemode_dict:
                chara2voicemode_dict[charaName].append(voiceMode)
            else:
                chara2voicemode_dict[charaName] = [voiceMode]
        return chara2voicemode_dict
    
    @property
    def VoicePresetNames(self)->list[str]:
        if self.tts_control is None:
            raise Exception("AIVoiceEditorが起動していません")
        voicePresetNames = self.convertPythonList(self.tts_control.VoicePresetNames)
        # [ '琴葉 茜 - 新規', '琴葉 茜', '琴葉 茜（蕾）', '琴葉 葵', '琴葉 葵（蕾）' ]
        return voicePresetNames
    
    @property
    def VoiceModels(self)->list[VoiceMode]:
        voiceModeList:list[VoiceMode] = []
        for name in self.VoicePresetNames:
            voicePresetModel = self.GetVoicePreset(name)
            voiceModeList.append(VoiceMode(mode = name, id_str = voicePresetModel.VoiceName))
        return voiceModeList

            
    
    def GetVoicePreset(self,voice_preset:str)->VoicePresetModel:
        """
        AIVoiceではvoice_modeはボイスプリセット名と呼ばれている。これからボイスプリセット情報を取得する。
        """
        if self.tts_control is None:
            raise Exception("AIVoiceEditorが起動していません")
        tmp_voicePreset_jsonStr:str = self.tts_control.GetVoicePreset(voice_preset)
        tmp_voicePresetDict:dict = json.loads(tmp_voicePreset_jsonStr)
        voicePreset:VoicePresetModel = VoicePresetModel(**tmp_voicePresetDict)

        # ExtendFunc.ExtendPrint(voicePreset)

        return voicePreset
    
    def createVoiceModeDict(self)->dict[CharacterName,list[VoiceMode]]:
        #標準ボイスモードを辞書にする
        defaultVoiceModeDict:dict[CharacterName,list[VoiceMode]] = self.CharaNames2DefalutVoiceModeDict
        emptyVoiceModeDict:dict[CharacterName,list[VoiceMode]] = {}
        #その後、id_strが同じ自作プリセットを各キャラのリストに追加する
        for voicemode in self.VoiceModels:
            if voicemode.id_str == None:
                raise Exception("id_strがNoneです")
            searched_charaName = AIVoiceHuman.searchCharaName(voicemode.id_str,defaultVoiceModeDict)
            if searched_charaName is not None:
                if searched_charaName in emptyVoiceModeDict:
                    emptyVoiceModeDict[searched_charaName].append(voicemode)
                else:
                    emptyVoiceModeDict[searched_charaName] = [voicemode]

        return emptyVoiceModeDict



    @staticmethod
    def searchCharaName(search_id:str,target_dict:dict[CharacterName,list[VoiceMode]])->CharacterName|None:
        for charaName,voiceModeList in target_dict.items():
            for voiceMode in voiceModeList:
                if voiceMode.id_str == search_id:
                    return charaName  
        return None      

        

    @staticmethod
    def convertAIVoiceName2CharaName(voice_name:str)->CharacterName:
        """
        AIVOICEの名前は半角スペースが入っているので、それを取り除いてキャラ名にする。
        また、（蕾）などのサブ名前は取り除く。「（」は全角のカッコが入っている。
        """
        name = voice_name.replace(" ","")
        if "（" in name:
            name = name.split("（")[0]
        return CharacterName(name = name)
    
    def updateAllCharaList(self):
        """
        AIVoiceのキャラクター名を取得して、AIVOICEKnownNames.jsonを更新する
        1.いきなり完成版のボイスモード辞書を作成

        1. AIVoiceのキャラクター名を取得
        2. キャラクター名リストを更新
        3. キャラクター名からボイスモード名リストを返す辞書    を更新
        4. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
        5. キャラクター名からニックネームリストを返す辞書      を更新
        """
        try:
            all_human_info_manager = AllHumanInformationManager.singleton()
            #2. キャラクター名リストを更新
            charaNames = self.CharaNames
            all_human_info_manager.chara_names_manager.updateCharaNames(TTSSoftware.AIVoice,charaNames)
            #3. キャラクター名からボイスモード名リストを返す辞書    を更新
            voiceModeDict:dict[CharacterName,list[VoiceMode]] = self.createVoiceModeDict()
            all_human_info_manager.CharaNames2VoiceModeDict_manager.updateCharaNames2VoiceModeDict(TTSSoftware.AIVoice,voiceModeDict)
            #4. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
            all_human_info_manager.human_images.tryAddHumanFolder(charaNames)
            #5. キャラクター名からニックネームリストを返す辞書      を更新
            all_human_info_manager.nick_names_manager.tryAddCharacterNameKey(charaNames)
        except Exception as e:
            print(e)
            print("AIVoiceのキャラクター名取得に失敗しました。起動してないかもしれません")
    
    def updateCharName(self):
        """
        1.何らかのAIVOICEのボイロを起動したときに呼び出して新しいキャラが要れば更新する
        todo この関数を呼び出すタイミングを考える
        2.KnownNames.jsonに自分が持っているキャラがいない人はいつ呼び出すか決まっていない。
        """
        # 同じapi_dirにアクセスするので効率化のために先に取得しておく
        api_dir = ExtendFunc.getTargetDirFromParents(__file__, "api")
        
        # AIVOICEKnouwnNames.jsonを取得する
        AIVOICEKnouwnNames_path = api_dir / "CharSettingJson/AIVOICEKnownNames.json"
        knouwn_name_list:list[str] = ExtendFunc.loadJsonToList(AIVOICEKnouwnNames_path)
        
        # 利用可能なキャラクター名一覧を取得
        voiceNames = self.VoiceNames
        now_voicePresetNames = self.VoicePresetNames
        # 新しく追加されたボイスロイドの名前など、known_name_listにない名前をname_listに追加する
        necessity_update_knouwn_name_list = False
        for name in voiceNames:
            if name not in knouwn_name_list:
                knouwn_name_list.append(name)
                necessity_update_knouwn_name_list = True
        # AIVOICEKnouwnNames.jsonを更新する必要があれば更新する
        if necessity_update_knouwn_name_list:
            ExtendFunc.saveListToJson(AIVOICEKnouwnNames_path,knouwn_name_list)

        # 既に知っている名前に自分で追加したプリセットの名前を追加して使用可能な名前一覧を更新する
        new_name_list:list[str] = [] + knouwn_name_list
        for name in now_voicePresetNames:
            if name not in knouwn_name_list:
                new_name_list.append(name)
        # AIVOICENameForVoiceroidAPI.jsonを取得する
        AIVOICENameForVoiceroidAPI_path = api_dir / "CharSettingJson/AIVOICENameForVoiceroidAPI.json"
        old_name_list:list[str] = list(ExtendFunc.loadJsonToDict(AIVOICENameForVoiceroidAPI_path).values())
        
        #old_name_listとnew_name_listを比較して、違う名前があればchange_name_listに追加する
        change_name_list = []
        necessity_update_AIVOICEname_list = False
        set_old_name_list = set(old_name_list)
        set_new_name_list = set(new_name_list)
        #２つのsetが同じかどうかを比較する
        if set_old_name_list != set_new_name_list:
            new_name_dict:dict[str,str] = {}
            for name in new_name_list:
                # AIVOICEの名前は半角スペースが入っているので、それを取り除いてキーにする
                key_name = name.replace(" ","")
                new_name_dict[key_name] = name
            ExtendFunc.saveDictToJson(AIVOICENameForVoiceroidAPI_path,new_name_dict)
        
        return "update完了"


    def getVoiceQuery(self,text:str):
        pass
    
    def getVoiceWav(self,query):
        pass
    
    def speak(self,text):
        pass

    def saveWav(self,response_wav):
        pass


class CoeiroinkWavRange(TypedDict):
    start: int
    end: int

class CoeiroinkPhonemePitch(TypedDict):
    phoneme: str
    wavRange: CoeiroinkWavRange

class CoeiroinkMoraDuration(TypedDict):
    mora: str
    hira: str
    phonemePitches: list[CoeiroinkPhonemePitch]
    wavRange: CoeiroinkWavRange

class CoeiroinkWaveData(TypedDict):
    wavBase64: str
    moraDurations: list[CoeiroinkMoraDuration]

class CoeiroinkStyle(TypedDict):
    styleName: str
    styleId: int
    base64Icon: str
    base64Portrait: str

class CoeiroinkSpeaker(TypedDict):
    speakerName: str
    speakerUuid: str
    styles: list[CoeiroinkStyle]
    version: str
    base64Portrait: str

class Coeiroink:
    DEFAULT_SERVER = "http://127.0.0.1:50032"
    none_num = -1
    server = DEFAULT_SERVER
    name: str|None = None
    onTTSSoftware:bool = False #vCoeiroinkが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #Coeiroinkがインストールされているかどうか

    def __init__(self,name:str|None,started_coeiro_num:int) -> None:
        if name is None:
            return
        self.updateAllCharaList()
        if "" != self.getCharNum(name):
            self.styleId = self.getCharNum(name)
            if self.styleId == Coeiroink.none_num:
                print(f"{name}はcoeiroinkに登録されていません。")
                Coeiroink.createCoeiroinkNameToNumberDict()
                return

            self.speaker = Coeiroink.get_speaker_info(self.styleId)
            self.char_name = name
        else:
            self.char_name = ""
            self.name = ""
    

    @staticmethod
    def getCharNum(name)->int:
        """
        coeiroinkとの通信で使う名前。
        front_nameとchar_nameのようなgptや画像管理で使うための名前ではない。
        """
        name_dict = JsonAccessor.loadCoeiroinkNameToNumberJson()
        if name in name_dict:
            return name_dict[name]
        
        return Coeiroink.none_num
    
    # ステータスを取得する
    @staticmethod
    def get_status(print_error=False) -> str|None:
        try:
            response = requests.get(f"{Coeiroink.server}/")
            response.raise_for_status()
            return response.json()["status"]
        except Exception as err:
            if print_error:
                print(err)
            return None

    # 話者リストを取得する
    @staticmethod
    def get_speakers(print_error=False) -> dict|None:
        try:
            response = requests.get(f"{Coeiroink.server}/v1/speakers")
            response.raise_for_status()
            return response.json()
        except Exception as err:
            if print_error:
                print(err)
            return None

    # スタイルIDから話者情報を取得する
    @staticmethod
    def get_speaker_info(styleId: int, print_error=False) -> dict|None:
        try:
            post_params = {"styleId": styleId}
            response = requests.post(f"{Coeiroink.server}/v1/style_id_to_speaker_meta", params=post_params)
            response.raise_for_status()
            return response.json()
        except Exception as err:
            if print_error:
                print(err)
            return None

    # テキストの読み上げ用データを取得する
    @staticmethod
    def estimate_prosody(text: str, print_error=False) -> dict|None:
        try:
            post_params = {"text": text}
            response = requests.post(f"{Coeiroink.server}/v1/estimate_prosody", data=json.dumps(post_params))
            response.raise_for_status()
            return response.json()
        except Exception as err:
            if print_error:
                print(err)
            return None
    
    @staticmethod
    def predict_with_duration(speaker: dict, text: str, prosody: dict,
                  speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                  prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False) -> CoeiroinkWaveData|None:
        """
        wavBase64とlabデータを取得できる。
        """
        
        post_params = {
            "speakerUuid": speaker["speakerUuid"],
            "styleId": speaker["styleId"],
            "text": text,
            "prosodyDetail": prosody["detail"],
            "speedScale": 1,
            "volumeScale": volumeScale,
            "pitchScale": pitchScale,
            "intonationScale": intonationScale,
            "prePhonemeLength": prePhonemeLength,
            "postPhonemeLength": postPhonemeLength,
            "outputSamplingRate": outputSamplingRate
        }
        print("678")

        try:
            response = requests.post(f"{Coeiroink.server}/v1/predict_with_duration", data=json.dumps(post_params))
            response.raise_for_status()
            return response.json()
        except Exception as err:
            print(err)
            return None

    # 音声データを生成する
    @staticmethod
    def synthesis(speaker: dict, text: str, prosody: dict,
                  speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                  prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False) -> bytes|None:
        post_params = {
            "speakerUuid": speaker["speakerUuid"],
            "styleId": speaker["styleId"],
            "text": text,
            "prosodyDetail": prosody["detail"],
            "speedScale": speedScale,
            "volumeScale": volumeScale,
            "pitchScale": pitchScale,
            "intonationScale": intonationScale,
            "prePhonemeLength": prePhonemeLength,
            "postPhonemeLength": postPhonemeLength,
            "outputSamplingRate": outputSamplingRate
        }
        try:
            response = requests.post(f"{Coeiroink.server}/v1/synthesis", data=json.dumps(post_params))
            response.raise_for_status()
            return response.content
        except Exception as err:
            if print_error:
                print(err)
            return None
    
    @staticmethod
    def labDataFromMora(moraDurations)->tuple[list[list[str]],list[str]]:
        """
        predictionからlabデータを取得する。labDataは他のボイロと同じくphonome_strで
        [[phoneme,start,end]]である
        """
        phoneme_str = []
        phoneme_time = []
        for moraDuration in moraDurations:
            phonemePitches:list[dict] = moraDuration["phonemePitches"]
            print(moraDuration["wavRange"])
            for phonemePitche in phonemePitches:
                print(phonemePitche)
                phoneme = phonemePitche["phoneme"]
                start = phonemePitche["wavRange"]["start"] / (10**5)
                end = phonemePitche["wavRange"]["end"] / (10**5)

                phoneme_str.append([phoneme,start,end])
                phoneme_time.append(phoneme)
        pprint(phoneme_str)
        return phoneme_str, phoneme_time

    # 音声データを生成する
    @staticmethod
    def get_wave_data(styleId: int, text: str,
                      speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                      prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False) -> bytes|None:

        speaker = Coeiroink.get_speaker_info(styleId)
        if speaker is None:
            print("Failed to get speaker info.")
            return None
        
        prosody = Coeiroink.estimate_prosody(text)
        if prosody is None:
            print("Failed to estimate prosody.")
            return None
        
        return Coeiroink.synthesis(speaker, text, prosody,
                                      speedScale, volumeScale, pitchScale, intonationScale,
                                      prePhonemeLength, postPhonemeLength, outputSamplingRate, print_error)
    
    def getWavData(self, text: str,
                      speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                      prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False) -> bytes|None:
        speaker = self.speaker
        if speaker is None:
            print("Failed to get speaker info.")
            return None
        
        prosody = Coeiroink.estimate_prosody(text)
        pprint(prosody)
        if prosody is None:
            print("Failed to estimate prosody.")
            return None
        
        return Coeiroink.synthesis(speaker, text, prosody,
                                      speedScale, volumeScale, pitchScale, intonationScale,
                                      prePhonemeLength, postPhonemeLength, outputSamplingRate, print_error)
    
     # 音声データを生成する
    @staticmethod
    def get_wave_and_lab_data(styleId: int, text: str,
                      speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                      prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False):

        speaker = Coeiroink.get_speaker_info(styleId)
        if speaker is None:
            print("Failed to get speaker info.")
            return None
        
        prosody = Coeiroink.estimate_prosody(text)
        if prosody is None:
            print("Failed to estimate prosody.")
            return None
        prediction = Coeiroink.predict_with_duration(speaker, text, prosody,
                                                      speedScale, volumeScale, pitchScale, intonationScale,
                                                      prePhonemeLength, postPhonemeLength, outputSamplingRate, print_error)
        if prediction is None:
            raise Exception("Failed to get prediction.")
        
        wavBase64 = prediction["wavBase64"]
        moraDurations = prediction["moraDurations"]
        phoneme_str, phoneme_time = Coeiroink.labDataFromMora(moraDurations)
        return wavBase64, phoneme_str,phoneme_time

    def getWavAndLabData(self, text: str,
                      speedScale = 1, volumeScale = 1, pitchScale = 0, intonationScale = 1,
                      prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False):
        speaker = self.speaker
        if speaker is None:
            print("Failed to get speaker info.")
            return None, None, None
        
        prosody = Coeiroink.estimate_prosody(text)
        if prosody is None:
            print("Failed to estimate prosody.")
            return None, None, None
        prediction = Coeiroink.predict_with_duration(speaker, text, prosody,
                                                      speedScale, volumeScale, pitchScale, intonationScale,
                                                      prePhonemeLength, postPhonemeLength, outputSamplingRate, print_error)
        if prediction is None:
            raise Exception("Failed to get prediction.")
        wavBase64 = prediction["wavBase64"]
        moraDurations = prediction["moraDurations"]
        phoneme_str, phoneme_time = Coeiroink.labDataFromMora(moraDurations)
        return wavBase64, phoneme_str, phoneme_time

    
    @staticmethod
    def wav2base64(wav):
        binary_data = wav.content
        base64_data = base64.b64encode(binary_data)
        base64_data_str = base64_data.decode("utf-8")
        return base64_data_str
    
    def saveWav(self,response_wav):
        with open("audio.wav", "wb") as f:
            f.write(response_wav.content)

    def playWav_pyaudio(self,response_wav):
        p = pyaudio.PyAudio()
        stream =  p.open(format=pyaudio.paInt16,
                         channels=1,
                         rate=24000,
                         output=True)
        stream.write(response_wav.content)

        stream.stop_stream()
        stream.close()

        p.terminate()
    
    def outputWaveFile(self,content:str):
        """
        todo : 声色インク用の改造が終わってないので、この関数は未完成
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        sentence_list = content.split("。")
        print(sentence_list)
        #output_wav_info_listを初期化
        self.output_wav_info_list = []
        for index,text in enumerate(sentence_list):
            if text == "":
                continue
            else:
                #output_wavフォルダがなければ作成
                os.makedirs("output_wav", exist_ok=True)
                print(f"coeiroinkでwav出力します:{index + 1}/{len(sentence_list)}")
                wav_path = f"output_wav/coeiroink_audio_{self.char_name}_{index}.wav"
                wav_data, phoneme_str, phoneme_time = self.getWavAndLabData(text)
                print("lab_data取得完了")
                print("wav_data取得完了")
                wav_info = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.char_name,
                    "voice_system_name":"Coeiroink"
                }
                self.output_wav_info_list.append(wav_info)
    
    @staticmethod
    def getCoeiroinkNameToNumberDict()->list[CoeiroinkSpeaker]:
        """
        todo : 声色インク用の改造が終わってないので、この関数は未完成
        まず
        curl -X 'GET' \
        'http://127.0.0.1:50021/speakers' \
        -H 'accept: application/json'
        を実行して、VOICEVOXのキャラクター名とキャラクター番号のjsonを取得する。
        次にVOICEVOXのキャラクター名とキャラクター番号の対応表を作成する。
        """

        url = "http://127.0.0.1:50032/v1/speakers"
        headers = {'accept': 'application/json'}
        response = requests.get(url, headers=headers)
        speaker_dict:list[CoeiroinkSpeaker] = response.json()
        return speaker_dict
    
    @staticmethod
    def createCoeiroinkNameToNumberDict():
        speaker_dict = Coeiroink.getCoeiroinkNameToNumberDict()
        save_dict = {}
        for speaker in speaker_dict:
            name = speaker["speakerName"]
            styles = speaker["styles"]
            for style in styles:
                style_name = style["styleName"]
                style_num = style["styleId"]
                save_name = name + ":" +style_name
                save_dict[save_name] = style_num
        pprint(save_dict)
        JsonAccessor.saveCoeiroinkNameToNumberJson(save_dict)

    @staticmethod
    def getCaharaNameList()->list[CharacterName]:
        speaker_dict = Coeiroink.getCoeiroinkNameToNumberDict()
        charaNameList = []
        for speaker in speaker_dict:
            charaNameList.append(CharacterName(name = speaker["speakerName"]))
        return charaNameList
    
    @staticmethod
    def getVoiceModeList()->list[VoiceMode]:
        """
        ボイスモードリストを作っても意味がなくなって来た気がするので削除するかもしれない
        """
        speaker_dict = Coeiroink.getCoeiroinkNameToNumberDict()
        voiceModeList = []
        for speaker in speaker_dict:
            styles = speaker["styles"]
            for style in styles:
                voiceMode = VoiceMode(mode = style["styleName"], id = style["styleId"])
                voiceModeList.append(voiceMode)
        return voiceModeList
    
    @staticmethod
    def getVoiceModeDict()->dict[CharacterName,list[VoiceMode]]:
        speaker_dict:list[CoeiroinkSpeaker] = Coeiroink.getCoeiroinkNameToNumberDict()
        voiceModeDict = {}
        for speaker in speaker_dict:
            charaName = CharacterName(name = speaker["speakerName"])
            styles = speaker["styles"]
            voiceModeList:list[VoiceMode] = []
            for style in styles:
                voiceMode = VoiceMode(mode = style["styleName"], id = style["styleId"])
                voiceModeList.append(voiceMode)
            voiceModeDict[charaName] = voiceModeList
        return voiceModeDict
    
    def updateAllCharaList(self):
        Coeiroink.updateAllCharaListStatic()
    
    @staticmethod
    def updateAllCharaListStatic():
        try:
            manager = AllHumanInformationManager.singleton()
            
            charaNameList:list[CharacterName] = Coeiroink.getCaharaNameList()
            voiceModeList:list[VoiceMode] = Coeiroink.getVoiceModeList()
            voiceModeDict:dict[CharacterName,list[VoiceMode]] = Coeiroink.getVoiceModeDict()
            manager.voice_mode_names_manager.updateVoiceModeNames(TTSSoftware.Coeiroink,voiceModeList)
            manager.chara_names_manager.updateCharaNames(TTSSoftware.Coeiroink,charaNameList)
            manager.CharaNames2VoiceModeDict_manager.updateCharaNames2VoiceModeDict(TTSSoftware.Coeiroink,voiceModeDict)
            manager.human_images.tryAddHumanFolder(charaNameList)
            manager.nick_names_manager.tryAddCharacterNameKey(charaNameList)
        except Exception as e:
            # coeiroinkが起動してないとき
            print(e)
            print("Coeiroinkのキャラクター名取得に失敗しました。起動してないかもしれません")

    @staticmethod
    def find_coeiroink_exe_path():
        defalut_exe_name = "COEIROINKv2.exe"
        retPath:str = JsonAccessor.loadAppSetting()["COEIROINKv2設定"]["path"]
        # 存在していてpathが正しいかチェック
        if retPath != "" and os.path.exists(retPath):
            return retPath
        
        # 見つからなかった場合は検索

        try:
            # ユーザーのダウンロードフォルダを優先的に検索
            download_folder = os.path.join(os.path.expanduser("~"), "Downloads")
            for root, dirs, files in os.walk(download_folder):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)
            
            # Cドライブ全体から検索
            for root, dirs, files in os.walk("C:\\"):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)

            # Dドライブ全体から検索
            for root, dirs, files in os.walk("D:\\"):
                if defalut_exe_name in files:
                    return os.path.join(root, defalut_exe_name)


            #pc全体の中からCOEIROINKv2.exeを探す
            for drive in psutil.disk_partitions():
                if os.path.isdir(drive.device):
                    for root, dirs, files in os.walk(drive.device):
                        if defalut_exe_name in files:
                            return root
        except Exception as e:
            ExtendFunc.ExtendPrint(e)
            return None
        
    @staticmethod
    def saveCoeiroinkPath(path:str):
        app_setting = JsonAccessor.loadAppSetting()
        app_setting["COEIROINKv2設定"]["path"] = path
        JsonAccessor.saveAppSetting(app_setting)

    @staticmethod
    def startCoeiroink()->"Coeiroink":
        tmp_human = Coeiroink(None,0)

        coeiroink_exe_path = Coeiroink.find_coeiroink_exe_path()
        ExtendFunc.ExtendPrint(coeiroink_exe_path)

        if coeiroink_exe_path is None:
            print("Coeiroinkのインストール場所が見つかりませんでした。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.NotInstalled
            tmp_human.onTTSSoftware = False
            return tmp_human
        
        Coeiroink.saveCoeiroinkPath(coeiroink_exe_path)

        try:
            # 非同期でプロセスを起動
            subprocess.Popen([coeiroink_exe_path])
            print("Coeiroinkが正常に起動しました。")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = True
            return tmp_human
        except Exception as e:
            print(f"Coeiroinkの起動に失敗しました: {e}")
            tmp_human.hasTTSSoftware = TTSSoftwareInstallState.Installed
            tmp_human.onTTSSoftware = False
            return tmp_human

class HasTTSState(Protocol):
    hasTTSSoftware:TTSSoftwareInstallState
    onTTSSoftware:bool
    def updateAllCharaList(self):
        pass

class TTSSoftwareManager:
    _instance:"TTSSoftwareManager"
    onTTSSoftwareDict:dict[TTSSoftware,bool] = {
        TTSSoftware.AIVoice:False,
        TTSSoftware.CevioAI:False,
        TTSSoftware.VoiceVox:False,
        TTSSoftware.Coeiroink:False
    }

    hasTTSSoftwareDict:dict[TTSSoftware,TTSSoftwareInstallState] = {
        TTSSoftware.AIVoice:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.CevioAI:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.VoiceVox:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.Coeiroink:TTSSoftwareInstallState.NotInstalled
    }

    HasTTSStateDict:dict[TTSSoftware,HasTTSState] = {}

    """
    各種ボイスロイドの起動を管理する
    """
    def __init__(self):
        pass

    @staticmethod
    def singleton():
        if not hasattr(TTSSoftwareManager, "_instance"):
            TTSSoftwareManager._instance = TTSSoftwareManager()
        return TTSSoftwareManager._instance

    @staticmethod
    def tryStartAllTTSSoftware():
        """
        全てのボイスロイドを起動する
        """
        for ttss in TTSSoftware:
            TTSSate = TTSSoftwareManager.tryStartTTSSoftware(ttss)
            TTSSoftwareManager.HasTTSStateDict[ttss] = TTSSate

    @staticmethod
    def tryStartTTSSoftware(ttss:TTSSoftware)->HasTTSState:
        """
        各種ボイスロイドを起動する
        """
        
        if ttss == TTSSoftware.AIVoice:
            tmp_human = AIVoiceHuman(None,0)
        elif ttss == TTSSoftware.CevioAI:
            tmp_human = cevio_human(None,0)
        elif ttss == TTSSoftware.VoiceVox:
            tmp_human = voicevox_human.startVoicevox()
        elif ttss == TTSSoftware.Coeiroink:
            tmp_human = Coeiroink.startCoeiroink()
        
        mana = TTSSoftwareManager.singleton()
        mana.onTTSSoftwareDict[ttss] = tmp_human.onTTSSoftware
        mana.hasTTSSoftwareDict[ttss] = tmp_human.hasTTSSoftware
        return tmp_human
    
    @staticmethod
    def updateAllCharaList():
        """
        ボイロの起動コマンド直後にやると、声色インクとかが、非同期ではなく別プロセスで実行されてるせいで失敗することがあるのでアプデボタンを押したときに実行するようにする。また、通信に失敗した場合はエラーを投げる。
        """
        for ttss in TTSSoftware:
            TTSSoftwareManager.updateCharaList(ttss,TTSSoftwareManager.HasTTSStateDict[ttss])

    @staticmethod
    def updateCharaList(ttss:TTSSoftware, tmp_human:HasTTSState):
        """
        各種ボイスロイドのキャラクターリストを更新する
        """
        if tmp_human.hasTTSSoftware == TTSSoftwareInstallState.Installed and tmp_human.onTTSSoftware:
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリストを更新します。")
            tmp_human.updateAllCharaList()
        else:
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリストの更新に失敗しました。",tmp_human)
        
     



class voiceroid_apiTest:
    def __init__(self) -> None:
        if False:
            print("開始")
            one = cevio_human("おね",0)
            ia = cevio_human("ia",1)
            tudumi = cevio_human("つづみ",2)
            one.outputWaveFile("おはよう")
            ia.outputWaveFile("おねちゃんきょーもかみぼさぼさじゃーん")
            tudumi.outputWaveFile("ほんとね、といてあげるわ")

        elif False:
            tumugi = voicevox_human("春日部つむぎ",0)
            tumugi.speak("あーしはつむぎ,埼玉１のギャルの春日部つむぎだよ、よろしくねオタク君")

        elif False:
            aoi = AIVoiceHuman("琴葉葵",0)
            aoi.outputWaveFile("あーしは葵,埼玉１のギャルの琴葉葵だよ、よろしくねオタク君")
        elif False:
            print("開始")
            voicevox_human.createVoiceVoxNameToNumberDict()
            print("終了")

        elif False:
            print("開始")
            Coeiroink.createCoeiroinkNameToNumberDict()
            print("終了")
        elif False:
            wav = Coeiroink.get_wave_data(1315987311, "いまははは")
            # 音声をファイルに保存
            with open("test.wav", "wb") as f:
                f.write(wav)
        elif False:
            horomegu = Coeiroink("幌呂めぐる",0)
            wav = horomegu.getWavData("こんにちは、私はほろめぐだよおおおおおお。")
            # 音声をファイルに保存
            with open("test.wav", "wb") as f:
                f.write(wav)

        elif False:
            dic = voicevox_human.getSpeakerDict()
            pprint(dic)

        elif True:
            aivoice = AIVoiceHuman("琴葉葵",0)
            # voicemodeDictを生成
            ExtendFunc.ExtendPrint(aivoice.CharaNames)
            voiceModeDict = aivoice.createVoiceModeDict()
            ExtendFunc.ExtendPrint(voiceModeDict)

            # ExtendFunc.ExtendPrint(aivoice.CharaNames)
            # ExtendFunc.ExtendPrint(aivoice.VoiceModels)



            