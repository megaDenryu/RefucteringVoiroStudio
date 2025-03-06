from uuid import uuid4
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingSaveModel import AIVoiceCharacterSettingSaveModel
from api.DataStore.CharacterSetting.CevioAICharacterSettingSaveModel import CevioAICharacterSettingSaveModel
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingSaveModel import CoeiroinkCharacterSettingSaveModel
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingSaveModel import VoiceVoxCharacterSettingSaveModel
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName, TTSSoftwareType
from api.DataStore.CharacterSetting.CevioAICharacterSettingCollection import CevioAICharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingCollection import VoiceVoxCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingCollection import AIVoiceCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingCollection import CoeiroinkCharacterSettingCollectionOperator
from api.gptAI.HumanInfoValueObject import CharacterName, HumanImage, ICharacterName, IHumanImage, IVoiceMode, NickName, TTSSoftware, VoiceMode, TTSSoftwareType, CharacterId, CharacterSaveId


class CharacterSettingCollectionOperatorManager:
    @staticmethod
    def getCharacterSettingCollectionOperator(tts_software: TTSSoftwareType):
        if tts_software == "CevioAI":
            return CevioAICharacterSettingCollectionOperator.singleton()
        elif tts_software == "VoiceVox":
            return VoiceVoxCharacterSettingCollectionOperator.singleton()
        elif tts_software == "AIVoice":
            return AIVoiceCharacterSettingCollectionOperator.singleton()
        elif tts_software == "Coeiroink":
            return CoeiroinkCharacterSettingCollectionOperator.singleton()
        else:
            raise Exception("operator is None")

    @staticmethod
    def getSaveIdFromNickName(tts_software: TTSSoftwareType,front_name:str)->CharacterSaveId:
        operator = CharacterSettingCollectionOperatorManager.getCharacterSettingCollectionOperator(tts_software)
        saveDatas = operator.getByNickName(NickName(name=front_name))
        if len(saveDatas) == 0:
            return str(uuid4())
        return saveDatas[0].saveID
    
    @staticmethod
    def getNickNameFromSaveId(tts_software: TTSSoftwareType,save_id:CharacterSaveId)->NickName:
        operator = CharacterSettingCollectionOperatorManager.getCharacterSettingCollectionOperator(tts_software)
        saveDatas = operator.getBySaveID(CharacterSaveId(save_id))
        if len(saveDatas) == 0:
            return NickName(name="None")
        return saveDatas[0].characterInfo.nickName
    
    @staticmethod
    def getSaveDatasFromNickName(nick_name:NickName)->list[AIVoiceCharacterSettingSaveModel] | list[CevioAICharacterSettingSaveModel] | list[CoeiroinkCharacterSettingSaveModel] | list[VoiceVoxCharacterSettingSaveModel]|None:
        for tts_software in TTSSoftware.get_all_software_names():
            operator = CharacterSettingCollectionOperatorManager.getCharacterSettingCollectionOperator(tts_software)
            saveDatas = operator.getByNickName(nick_name)
            if len(saveDatas) != 0:
                return saveDatas
        # 一致するものがない場合、[ニックネーム候補]を見てキャラクターをまず特定し、その後に起動中のそのキャラクターのsaveDatasを返せば良い
        # [ニックネーム候補]は、あらかじめ作っておく + 既存の名前、ニックネームに部分的に入力ニックネームがマッチしたものを返す感じ
        return None
    
    @staticmethod
    def getNickNameList()->list[NickName]:
        nick_name_list:list[NickName] = []
        for tts_software in TTSSoftware.get_all_software_names():
            operator = CharacterSettingCollectionOperatorManager.getCharacterSettingCollectionOperator(tts_software)
            for data in operator.collection.collection:
                nick_name_list.append(data.characterInfo.nickName)
        return nick_name_list
    
    
        