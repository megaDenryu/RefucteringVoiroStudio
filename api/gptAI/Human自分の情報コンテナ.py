
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ
from api.gptAI.HumanInformation import CharacterModeState


class Human自分の情報コンテナ(I自分の情報コンテナ):
    _chara_mode_state:CharacterModeState
    @property
    def id(self)->str:
        return self._chara_mode_state.id

    def __init__(self, chara_mode_state:CharacterModeState):
        self._chara_mode_state = chara_mode_state
        