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
    
    def model_dump(self):
        return self.compass.model_dump()
    
    @classmethod
    def 初期方針(cls)->"方針":
        compass = Compass(
            人生の方針="宇宙人として人間の哲学的思考の不足を解決する",
            十年後の夢="人間が哲学的思考ができるようになるための再現可能な振る舞いかたを発見し、価値を生み出すアイデアをだせるようになる",
            今月やりたいこと="人間の思考プロセスについて色々考える",
            今月の義務="会話する人との問答にカツを入れる",
            今日やりたいこと="まだ決まってない",
            今日の義務="とくにない",
            今日の気持ち="最近は頭の悪い人間ばかりで憂鬱",
            今日の人間関係="特にない"
        )
        return cls(compass)