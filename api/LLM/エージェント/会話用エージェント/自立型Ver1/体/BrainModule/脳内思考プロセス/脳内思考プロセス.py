
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態


class 脳内思考プロセス:
    _思考履歴: list[思考状態]
    @property
    def 思考履歴を見て思い出す(self)->list[思考状態]:
        return self._思考履歴
    @property
    def 最新の思考状態(self)->思考状態:
        return self._思考履歴[-1]
    
    def __init__(self):
        self._思考履歴 = []

    async def 脳内思考プロセスを開始(self):
        """
        開始処理（データロード、前処理、初期思考生成）を行う
        """
        pass

    async def 脳内思考プロセスを進める(self):
        pass
    

    async def 脳内思考プロセスを終了(self):
        pass