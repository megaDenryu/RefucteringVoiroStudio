from pydantic import BaseModel


# 表現したいことをまとめるためのオブジェクト。LLMからボイロに渡したりする。
class PresentationByBody(BaseModel):
    文章: str
    感情: str