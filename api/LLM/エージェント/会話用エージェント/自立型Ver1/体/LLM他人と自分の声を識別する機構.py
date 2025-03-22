from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.Conversation import Conversation
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.体内信号機.体内信号機 import 体内信号機
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体を持つ者.I自分の情報 import I自分の情報コンテナ
from api.LLM.エージェント.会話用エージェント.自立型Ver1.外部イベント import 外部イベント

class LLM他人と自分の声を識別する機構:
    _v最後の会話情報: MessageUnitVer1|None
    _v自分の情報: I自分の情報コンテナ
    _v体内信号機:体内信号機
    def __init__(self, v自分の情報: I自分の情報コンテナ, v体内信号機:体内信号機):
        self._v最後の会話情報 = None
        self._v自分の情報 = v自分の情報
        self._v体内信号機 = v体内信号機

    def 聞く(self, event:外部イベント)->list[MessageUnitVer1]|None:
        """ 
        AISpaceを介して他人の声を受け取る。自分の声も聞こえるがそれは除外するようにする
        その声は脳に渡す
        """
        # イベント会話と前に喋った履歴を比較して何が追加されたか識別する
        return self._フィルターする(event.会話)
        
    def _フィルターする(self, 会話:Conversation)->list[MessageUnitVer1]|None:
        if self._最後が自分の声か(会話) == True:
            return None
        return self.追加部分を検出(会話)
    
    def 追加部分を検出(self, 会話:Conversation) -> list[MessageUnitVer1]|None:
        if len(会話.history) == 0:
            return None

        if self._v最後の会話情報 is None:
            # 初回は全メッセージを返す
            self._v最後の会話情報 = 会話.history[-1]
            return 会話.history

        else:
            # 末尾から検索する（逆順）
            for i in range(len(会話.history) - 1, -1, -1):
                if 会話.history[i].id == self._v最後の会話情報.id:
                    # 見つかった位置の次から末尾までのすべてのメッセージを返す
                    if i < len(会話.history) - 1:
                        # 新しいメッセージをリストとして返す
                        new_messages = 会話.history[i+1:]
                        # 最新のメッセージを保存
                        self._v最後の会話情報 = 会話.history[-1]
                        return new_messages
                    else:
                        return None  # 新しいメッセージがない場合
            
            # 前回の最後のメッセージが見つからない場合は全メッセージを返す
            self._v最後の会話情報 = 会話.history[-1]
            return 会話.history  # すべてのメッセージを返す
        
    def _最後が自分の声か(self, 会話:Conversation)->bool:
        return 会話.history[-1].speaker.speakerId == self._v自分の情報.id