import uuid
from pydantic import BaseModel

from api.Extend.ExtendFunc import TimeExtend
from api.Extend.FormatConverter import BaseModel2MD
from api.Extend.FormatConverter.ConvertAndSaveLog import ConvertAndSaveLog


class Compass(BaseModel):
    人生の方針:str
    十年後の夢:str
    今月やりたいこと:str
    今月の義務:str
    今日やりたいこと:str
    今日の義務:str
    今日の気持ち:str
    今日の人間関係:str
    今日の体調:str

class 方針:
    id : str
    time: TimeExtend
    compass: Compass
    def __init__(self,compass: Compass) -> None:
        self.id = str(uuid.uuid4())
        self.time = TimeExtend()
        self.compass = compass
    def 内容(self)->str:
        return ConvertAndSaveLog.MarkdownConvert(model = self.compass, log=False)