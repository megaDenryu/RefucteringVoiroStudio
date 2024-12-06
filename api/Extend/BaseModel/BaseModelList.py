from typing import TypeVar, Generic
from pydantic import BaseModel

CollectionUnit = TypeVar("CollectionUnit", bound=BaseModel)

class BaseModelList(BaseModel, Generic[CollectionUnit]):
    list: list[CollectionUnit]


