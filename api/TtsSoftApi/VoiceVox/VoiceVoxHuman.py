import base64
import json
import os
from pathlib import Path
from pprint import pprint
import subprocess
from typing import Literal, TypedDict, Union
import winreg

import pyaudio
import requests
from requests import Response
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingCollection import VoiceVoxCharacterSettingCollectionOperator
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxQueryBaseTypedDict import QueryDict
from api.DataStore.ChatacterVoiceSetting.VoiceVoxVoiceSetting.VoiceVoxVoiceSettingModel import VoiceVoxVoiceSettingModel
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.ExtendSound import ExtendSound
from api.TtsSoftApi.voiceroid_api import TTSSoftwareInstallState
from api.gptAI.HumanInfoValueObject import CharacterName, CharacterSaveId, TTSSoftware, VoiceMode
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterModeState
from api.gptAI.VoiceInfo import WavInfo


class SpeakerStyle(TypedDict):
    id:int
    name:str
    type:Literal["talk"]
class SpeakerInfo(TypedDict):
    name:str
    styles:list[SpeakerStyle]
class VoiceVoxHuman:
    chara_mode_state:CharacterModeState|None
    onTTSSoftware:bool = False #voicevoxが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #voicevoxがインストールされているかどうか
    voiceSetting: VoiceVoxVoiceSettingModel|None
    query_url = f"http://127.0.0.1:50021/audio_query" #f"http://localhost:50021/audio_query"だとlocalhostの名前解決に時間がかかるらしい
    synthesis_url = f"http://127.0.0.1:50021/synthesis" #f"http://localhost:50021/synthesis"だとlocalhostの名前解決に時間がかかるらしい
    isSaveWaiting = False
    output_wav_info_list:list[WavInfo]
    @property
    def char_name(self):
        if self.chara_mode_state is None:
            raise Exception("chara_mode_stateがNoneです")
        return self.chara_mode_state.character_name.name
    @property
    def mode(self):
        if self.chara_mode_state is None:
            raise Exception("chara_mode_stateがNoneです")
        return self.chara_mode_state.voice_mode.id

    def __init__(self,chara_mode_state:CharacterModeState|None,started_voicevox_num:int) -> None:
        if chara_mode_state is None:
            return
        self.chara_mode_state = chara_mode_state
        if started_voicevox_num == 0:
            self.start()
        self.voiceSetting = self.loadVoiceSetting(chara_mode_state.save_id)

    def loadVoiceSetting(self,saveID:CharacterSaveId)->VoiceVoxVoiceSettingModel|None:
        """
        ボイス設定を取得する
        """
        charaSettingList = VoiceVoxCharacterSettingCollectionOperator.singleton().getBySaveID(saveID)
        if len(charaSettingList) == 0:
            return None
        voiceSetting = charaSettingList[0].voiceSetting
        return voiceSetting

    def setVoiceSetting(self, voiceSetting: VoiceVoxVoiceSettingModel):
        self.voiceSetting = voiceSetting

    def 設定を反映する(self,query_dict:QueryDict):
        """
        VoiceVoxVoiceSettingModelの設定をquery_dictに反映する
        """
        if self.voiceSetting is None:
            return query_dict
        query_dict["speedScale"] = self.voiceSetting.スピード
        query_dict["pitchScale"] = self.voiceSetting.ピッチ
        query_dict["intonationScale"] = self.voiceSetting.イントネーション
        query_dict["volumeScale"] = self.voiceSetting.音量
        return query_dict
        
    
    def start(self):
        VoiceVoxHuman.createVoiceVoxNameToNumberDict() #キャラアプデ処理旧
        self.updateAllCharaList() #キャラアプデ処理新
    
    @staticmethod
    def getCharNum(name:str):
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

    def getVoiceQuery(self, text: str):
        """
        todo TypedDictでボイボのquery_dictを定義する。現状は動いているので後回し
        """
        params = {
            'speaker': self.mode,
            'text': text
        }
        ExtendFunc.ExtendPrintWithTitle("ボイボ音声パラメ",params)
        query_dict:QueryDict = requests.post(self.query_url, params=params).json() #todo ここでの型を特定する必要がある。おそらくここで音量や話速などのパラメータが取れる
        return query_dict
    
    
    def getVoiceWav(self,query_dict:QueryDict)->Response:
        """
        getVoiceQuery()で取得したquery_dictを引数に使ってwavを生成する.
        """
        query_json = json.dumps(query_dict)
        wav = requests.post(self.synthesis_url, params={'speaker': self.mode}, data=query_json)
        return wav
    
    def wav2base64(self, wav: Union[bytes, Response]) -> str:
        if isinstance(wav, bytes):
            binary_data = wav
        elif isinstance(wav, Response):
            binary_data = wav.content
        else:
            raise TypeError("Unsupported type for wav parameter")
        base64_data = base64.b64encode(binary_data)
        base64_data_str = base64_data.decode("utf-8")
        return base64_data_str

    def getLabData(self,query_dict:QueryDict, pitchScale = None, speedScale = None, intonationScale = None):
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
        query:QueryDict = self.getVoiceQuery(text)
        query = self.設定を反映する(query)
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
    
    def outputWaveFile(self,content:str, chara_mode_state:CharacterModeState):
        """
        ２００文字以上だと切り詰められるので文節に区切って再生する
        """
        self.chara_mode_state = chara_mode_state
        sentence_list = content.split("。")
        print(sentence_list)
        self.output_wav_info_list = []
        for index,text in enumerate(sentence_list):
            if text == "":
                continue
            else:
                #output_wavフォルダがなければ作成
                os.makedirs("output_wav", exist_ok=True)
                print(f"voicevoxでwavを生成します:{index + 1}/{len(sentence_list)}")
                wav_path = f"output_wav/voicevox_audio_{self.char_name}_{index}.wav"
                query = self.getVoiceQuery(text)
                query = self.設定を反映する(query)
                print("query取得完了")
                phoneme_str,phoneme_time = self.getLabData(query)
                print("lab_data取得完了")
                wav_binary = self.getVoiceWav(query)
                wav_time = ExtendSound.get_wav_duration_from_data(wav_binary.content)
                ExtendFunc.ExtendPrintWithTitle(f"{text}のwav_time",wav_time)
                wav_data = self.wav2base64(wav_binary)
                print("wav_data取得完了")

                wav_info:WavInfo = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "wav_time":wav_time,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.char_name,
                    "voice_system_name":"VoiceVox",
                    "characterModeState": self.chara_mode_state.toDict()
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
        VoiceVoxHuman.updateAllCharaListStatic()
        
    
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
            speaker_dict = VoiceVoxHuman.getSpeakerDict()
            #2. キャラクター名リストを更新
            VoiceVoxHuman.updateCharaNames(speaker_dict)
            #3. キャラクター名からボイスモード名リストを返す辞書    を更新
            VoiceVoxHuman.updateVoiceModeInfo(speaker_dict)
            #4. キャラクター名から立ち絵のフォルダ名リストを返す辞書を更新
            VoiceVoxHuman.upadteNicknameAndHumanImagesFolder(speaker_dict)
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

        speaker_dict = VoiceVoxHuman.getSpeakerDict()
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

    