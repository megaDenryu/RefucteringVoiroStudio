import uuid
from pydantic import BaseModel

from api.Extend.ExtendFunc import TimeExtend
from api.Extend.FormatConverter import BaseModel2MD
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog


class CompassMidTerm(BaseModel):
    今月やりたいこと:str
    今月の義務:str

class 中期方針:
    id : str
    time: TimeExtend
    compass: CompassMidTerm
    def __init__(self,compass: CompassMidTerm) -> None:
        self.id = str(uuid.uuid4())
        self.time = TimeExtend()
        self.compass = compass
    def 内容(self)->str:
        return ConvertAndSaveLog.MarkdownConvert(model = self.compass, log=False)
    
    def model_dump(self):
        return self.compass.model_dump()
    
    @classmethod
    def 初期方針(cls)->"中期方針":
        compass = CompassMidTerm(
            今月やりたいこと="自分が何をしたいのか考える。",
            今月の義務="会話する人との問答にカツを入れる",
        )
        return cls(compass)