from pydantic import BaseModel, Field

class TalkerComponent2(BaseModel):
    Id: str = Field(frozen=True) #UIでも変更できないようにinputコンポネントではないものを表示するようにする
    Name: str = Field(frozen=True)
    Value: int = Field(min_value=0, max_value=100, default=50)