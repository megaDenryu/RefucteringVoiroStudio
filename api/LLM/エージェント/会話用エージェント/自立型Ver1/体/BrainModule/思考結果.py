from pydantic import BaseModel


class 思考結果(BaseModel):
    結論:str
    感情:str
    理由:str
