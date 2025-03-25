from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考プロセス状態 import 思考状態


class 思考結果(BaseModel):
    最新思考状態: 思考状態
