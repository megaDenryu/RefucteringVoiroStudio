from pydantic import BaseModel


class KanaText(BaseModel):
    フリガナ化文章: str
    下ネタならtrue: bool