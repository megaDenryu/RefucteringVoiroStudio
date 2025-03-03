from uuid import uuid4
from api.Extend.ExtendFunc import ExtendFunc
from api.gptAI.HumanInfoValueObject import NickName, TTSSoftwareType
from api.DataStore.CharacterSetting.CevioAICharacterSettingCollection import CevioAICharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingCollection import VoiceVoxCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingCollection import AIVoiceCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingCollection import CoeiroinkCharacterSettingCollectionOperator
from api.gptAI.HumanInfoValueObject import CharacterName, HumanImage, ICharacterName, IHumanImage, IVoiceMode, NickName, TTSSoftware, VoiceMode, TTSSoftwareType, CharacterId, CharacterSaveId


class CharacterSettingCollectionOperatorManager():
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
        