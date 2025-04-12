
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.自分の情報.I自分の情報 import I自分の情報コンテナ
from api.gptAI.HumanInformation import CharacterModeState


class Human自分の情報コンテナ(I自分の情報コンテナ):
    _chara_mode_state:CharacterModeState
    @property
    def id(self)->str:
        return self._chara_mode_state.id
    
    @property
    def 表示名(self)->str:
        return self._chara_mode_state.front_name

    def __init__(self, chara_mode_state:CharacterModeState):
        self._chara_mode_state = chara_mode_state

    @property
    def 自分の情報(self)->str:
        raise NotImplementedError("自分の情報は実装されていません。")
    def 自分の情報の更新(self)->None:
        """
        自分の情報を更新する。
        """
        raise NotImplementedError("自分の情報の更新は実装されていません。")
        