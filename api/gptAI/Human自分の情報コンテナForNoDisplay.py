
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ
from api.gptAI.CharacterModeStateForNoDisplay import CharacterModeStateForNoDisplay


class Human自分の情報コンテナForNoDisplay(I自分の情報コンテナ):
    _chara_mode_state:CharacterModeStateForNoDisplay
    @property
    def id(self)->str:
        return self._chara_mode_state.id
    
    @property
    def 表示名(self)->str:
        return self._chara_mode_state.character_name.name

    def __init__(self, chara_mode_state:CharacterModeStateForNoDisplay):
        self._chara_mode_state = chara_mode_state
        