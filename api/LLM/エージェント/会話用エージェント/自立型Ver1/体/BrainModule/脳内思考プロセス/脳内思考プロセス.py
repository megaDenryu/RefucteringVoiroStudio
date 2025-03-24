
from uuid import uuid4
from api.Extend.FormatConverter import BaseModel2MD
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog
from api.LLM.エージェント.会話用エージェント.自立型Ver1.会話履歴.ValueObject.MessageUnit import MessageUnitVer1
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.プロセス材料.プロセス材料を包んだもの import プロセス材料を包んだもの
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内表現イベント.I脳内表現イベント import I脳内表現イベント


class 脳内思考プロセス:
    _思考履歴: list[思考状態]
    _プロセス材料溜め置き場: list[プロセス材料を包んだもの]
    @property
    def 思考履歴を見て思い出す(self)->list[思考状態]:
        return self._思考履歴
    @property
    def 最新の思考状態(self)->思考状態:
        return self._思考履歴[-1]
    
    def __init__(self):
        初期思考状態:思考状態 = 思考状態(id = str(uuid4()), 思考内容 = "初期思考")
        self._思考履歴 = [初期思考状態]
        self._プロセス材料溜め置き場 = []

    async def 脳内思考プロセスを開始(self):
        """
        開始処理（データロード、前処理、初期思考生成）を行う
        """
        pass

    async def 脳内思考プロセスを進める(self, messageUnits:list[MessageUnitVer1]):
        new思考状態:思考状態 = 思考状態(
            id = str(uuid4()), 
            思考内容 = ConvertAndSaveLog.MarkdownConvertList(model = messageUnits, log=True)
        )
    

    async def 脳内思考プロセスを終了(self):
        pass

    def プロセス材料に変換して溜める(self, 脳内表現イベント: I脳内表現イベント):
        プロセス材料:プロセス材料を包んだもの = プロセス材料を包んだもの(脳内表現イベント)
        self._プロセス材料溜め置き場.append(プロセス材料)