import base64
import json
import os
import subprocess
from typing import TypedDict

import psutil
import pyaudio
import requests

from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingCollection import CoeiroinkCharacterSettingCollectionOperator
from api.DataStore.ChatacterVoiceSetting.CoeiroinkVoiceSetting.CoeiroinkVoiceSettingModel import CoeiroinkVoiceSettingModel
from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.ExtendSound import ExtendSound
from api.Extend.FileManager.FileSearch.domain.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.domain.LaunchResult import LaunchResult
from api.Extend.FileManager.FileSearch.util.launch_utils import LaunchUtils
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState
from api.gptAI.HumanInfoValueObject import CharacterName, CharacterSaveId, TTSSoftware, VoiceMode
from api.gptAI.HumanInformation import AllHumanInformationManager, CharacterModeState
from api.gptAI.VoiceInfo import WavInfo


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
    chara_mode_state:CharacterModeState|None
    output_wav_info_list:list[WavInfo]
    @property
    def char_name(self):
        if self.chara_mode_state is None:
            raise Exception("chara_mode_stateがNoneです")
        return self.chara_mode_state.character_name.name
    @property
    def styleId(self):
        if self.chara_mode_state is None:
            raise Exception("chara_mode_stateがNoneです")
        if self.chara_mode_state.voice_mode is None:
            raise Exception("voice_modeがNoneです")
        if self.chara_mode_state.voice_mode.id is None:
            raise Exception("voice_mode.idがNoneです")
        return self.chara_mode_state.voice_mode.id
    DEFAULT_SERVER = "http://127.0.0.1:50032"
    none_num = -1
    server = DEFAULT_SERVER
    onTTSSoftware:bool = False #vCoeiroinkが起動しているかどうか
    hasTTSSoftware:TTSSoftwareInstallState = TTSSoftwareInstallState.NotInstalled #Coeiroinkがインストールされているかどうか
    voiceSetting:CoeiroinkVoiceSettingModel

    def __init__(self, chara_mode_state:CharacterModeState|None, started_coeiro_num:int) -> None:
        if chara_mode_state is None:
            return
        self.chara_mode_state = chara_mode_state
        self.updateAllCharaList()
        self.speaker = Coeiroink.get_speaker_info(self.styleId)
        self.voiceSetting = self.loadVoiceSetting(chara_mode_state.save_id)

    def loadVoiceSetting(self,saveId:CharacterSaveId)->CoeiroinkVoiceSettingModel:
        """
        ボイス設定を取得する
        """
        setting_list = CoeiroinkCharacterSettingCollectionOperator.singleton().getBySaveID(saveId)
        if setting_list is None:
            return CoeiroinkVoiceSettingModel()
        if len(setting_list) == 0:
            return CoeiroinkVoiceSettingModel()
        return setting_list[0].voiceSetting
        

    def setVoiceSetting(self, voiceSetting: CoeiroinkVoiceSettingModel):
        self.voiceSetting = voiceSetting

    def speak(self,text:str):
        """
        テキストを読み上げる
        """
        pass
    
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
                  speedScale:float, volumeScale:float, pitchScale:float, intonationScale:float,
                  prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False) -> CoeiroinkWaveData|None:
        """
        wavBase64とlabデータを取得できる。
        """
        ExtendFunc.ExtendPrintWithTitle("Coeiroinkの音声データを取得します",f"{speedScale=},{volumeScale=},{pitchScale=},{intonationScale=}")
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
                      speedScale:float, volumeScale:float, pitchScale:float, intonationScale:float,
                      prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000, print_error=False):
        speaker = self.speaker
        if speaker is None:
            print("Failed to get speaker info.")
            return None, None, None, None
        
        prosody = Coeiroink.estimate_prosody(text)
        if prosody is None:
            print("Failed to estimate prosody.")
            return None, None, None, None
        prediction = Coeiroink.predict_with_duration(speaker, text, prosody,
                                                      speedScale, volumeScale, pitchScale, intonationScale,
                                                      prePhonemeLength, postPhonemeLength, outputSamplingRate, print_error)
        if prediction is None:
            raise Exception("Failed to get prediction.")
        wavBase64 = prediction["wavBase64"]
        wav = Coeiroink.processWithPitch(wavBase64,volumeScale,pitchScale,intonationScale,prePhonemeLength,postPhonemeLength,outputSamplingRate)
        wav_time = ExtendSound.get_wav_duration_from_data(wav)
        wavFromProcessWithPitch_Base64 = Coeiroink.wav2base64(wav)
        
        moraDurations = prediction["moraDurations"]
        phoneme_str, phoneme_time = Coeiroink.labDataFromMora(moraDurations)
        return wavFromProcessWithPitch_Base64, phoneme_str, phoneme_time ,wav_time
    
    @staticmethod
    def processWithPitch(wavBase64:str, volumeScale:float, pitchScale:float, intonationScale:float,
                  prePhonemeLength = 0.1, postPhonemeLength = 0.1, outputSamplingRate = 24000):
        """
        wavBase64を受け取って、pitchScaleを適用したwavBase64を返す。これにより音声設定を反映できる。
        """
        ProcessWithPitchRequestBody = {
            "wavBase64": wavBase64,
            "volumeScale": volumeScale,
            "pitchScale": pitchScale,
            "intonationScale": intonationScale,
            "prePhonemeLength": prePhonemeLength,
            "postPhonemeLength": postPhonemeLength,
            "outputSamplingRate": outputSamplingRate
        }
        try:
            response = requests.post(f"{Coeiroink.server}/v1/process_with_pitch", data=json.dumps(ProcessWithPitchRequestBody))
            response.raise_for_status()
            
            # レスポンスの内容を確認
            if response.content:
                try:
                    wav = response.content  # バイナリデータとして取得
                    return wav
                except Exception as err:
                    ExtendFunc.ExtendPrint(f"Error processing response: {err}")
                    return None
            else:
                ExtendFunc.ExtendPrint("Empty response received")
                return None
        except requests.exceptions.RequestException as err:
            ExtendFunc.ExtendPrint(f"Request error: {err}")
            return None
        except json.JSONDecodeError as err:
            ExtendFunc.ExtendPrint(f"JSON decode error: {err}")
            return None

    
    @staticmethod
    def wav2base64(wav):
        base64_data = base64.b64encode(wav)
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
    
    def outputWaveFile(self,content:str, chara_mode_state:CharacterModeState):
        """
        todo : 声色インク用の改造が終わってないので、この関数は未完成
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
                #output_wavフォルダがなければ作成
                os.makedirs("output_wav", exist_ok=True)
                print(f"coeiroinkでwav出力します:{index + 1}/{len(sentence_list)}")
                wav_path = f"output_wav/coeiroink_audio_{self.char_name}_{index}.wav"
                # 設定の取得
                ExtendFunc.ExtendPrint(self.voiceSetting)
                speedScale = self.voiceSetting.スピード
                volumeScale = self.voiceSetting.音量
                pitchScale = self.voiceSetting.ピッチ
                intonationScale = self.voiceSetting.イントネーション
                wav_data, phoneme_str, phoneme_time, wav_time = self.getWavAndLabData(text,speedScale,volumeScale,pitchScale,intonationScale) #todo : ここでピッチとか音量とかを変える
                # wav_time = ExtendSound.get_wav_duration_from_data(wav_data)
                ExtendFunc.ExtendPrint(f"{self.char_name}のwav_time",wav_time)
                print("lab_data取得完了")
                print("wav_data取得完了")
                if wav_data is None or phoneme_str is None or phoneme_time is None or wav_time is None:
                    ExtendFunc.ExtendPrint("声色インクの音声データの取得に失敗しました")
                    return
                
                wav_info:WavInfo = {
                    "path":wav_path,
                    "wav_data":wav_data,
                    "wav_time":wav_time,
                    "phoneme_time":phoneme_time,
                    "phoneme_str":phoneme_str,
                    "char_name":self.char_name,
                    "voice_system_name":"Coeiroink",
                    "characterModeState": self.chara_mode_state.toDict()
                }

                self.output_wav_info_list.append(wav_info)
    
    @staticmethod
    def getCoeiroinkNameToNumberDict()->list[CoeiroinkSpeaker]:
        """
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

    

    