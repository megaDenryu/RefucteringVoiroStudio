import enum
from typing import TypeVar
from pydantic import BaseModel

ResponseBaseModelT = TypeVar("ResponseBaseModelT", bound=BaseModel)
ResponseEnumT = TypeVar("ResponseEnumT", bound=enum.Enum)
