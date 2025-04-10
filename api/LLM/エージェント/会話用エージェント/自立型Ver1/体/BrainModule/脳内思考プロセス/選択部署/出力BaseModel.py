from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モジュール種類 import ThinkingModuleEnum


class ThinkingMethodSelecter(BaseModel):
    """
    思考方法選択器は、思考の方法を選択するためのクラスです。
    """
    a自由思考欄: list[str]
    b思考方法: ThinkingModuleEnum