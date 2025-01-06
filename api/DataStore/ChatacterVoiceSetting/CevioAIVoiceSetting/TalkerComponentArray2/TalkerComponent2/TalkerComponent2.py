from pydantic import BaseModel, Field

class TalkerComponent2(BaseModel):
    Id: str = Field(frozen=True, description="変更不可") #UIでも変更できないようにinputコンポネントではないものを表示するようにする
    Name: str = Field(frozen=True, description="変更不可")
    Value: int = Field(ge=0, le=100, default=50)