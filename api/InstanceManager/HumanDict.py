from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpaceInterface import AISpaceInterface
from api.gptAI.Human import Human
from api.gptAI.HumanInformation import CharacterId, CharacterModeState


class HumanInstanceContainer:
    _human_dict:dict[CharacterId,Human] = {}
    _voiceroid_dict = {"cevio":0,"voicevox":0,"AIVOICE":0,"Coeiroink":0}
    _aiSpace: AISpaceInterface
    @property
    def CharacterIds(self)->list[CharacterId]:
        return list(self._human_dict.keys())
    
    @property
    def Humans(self)->list[Human]:
        return list(self._human_dict.values())
    
    @property
    def HumanFrontNames(self)->list[str]:
        return [human.front_name for human in self.Humans]

    def __init__(self, aiSpace: AISpaceInterface):
        self._aiSpace = aiSpace

    def tryGetHuman(self,character_id:CharacterId)->Human|None:
        """
        人間の情報を取得する。存在しない場合は新たに生成する。
        """
        ExtendFunc.ExtendPrint(f"tryGetHuman:{character_id}")
        ExtendFunc.ExtendPrint(self._human_dict)
        if character_id not in self._human_dict:
            return None
        return self._human_dict[character_id]
    
    def updateHumanModeState(self,mode_state:CharacterModeState)->Human:
        characterId = mode_state.id
        human = self.tryGetHuman(characterId) or self.createHuman(mode_state)
        human.chara_mode_state = mode_state
        return human
    
    def createHuman(self,chara_mode_state:CharacterModeState)->Human:
        human = Human(chara_mode_state,self._voiceroid_dict)
        self._aiSpace.空間に人間を追加して会話履歴を注入(human)
        self._voiceroid_dict[human.voice_system] = self._voiceroid_dict[human.voice_system]+1
        self._human_dict[human.id] = human
        return human