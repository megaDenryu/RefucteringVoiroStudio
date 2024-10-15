import json
from pathlib import Path
from typing import Generic, Literal, Sequence, Type, TypeVar, TypedDict

from pydantic import BaseModel

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel


MapKey = TypeVar('MapKey', bound='HashableBaseModel')
MapValue = TypeVar('MapValue', bound='HashableBaseModel')
MapValueList = TypeVar('MapValueList', bound='Sequence[HashableBaseModel]')

class MapItemDictHasListValue(TypedDict):
    key: dict
    value: list[dict]

class MapItemHasListValue(HashableBaseModel, Generic[MapKey, MapValue, MapValueList]):
    key: MapKey
    values: list[MapValue]

    def toTypedDict(self)->MapItemDictHasListValue:
        return MapItemDictHasListValue(key=self.key.model_dump(), value=[value.model_dump() for value in self.values])
    
    @staticmethod
    def fromTypedDict(data: MapItemDictHasListValue, key_type: type[MapKey], value_type: type[MapValue]):
        key = key_type(**data["key"])
        values = [value_type(**value) for value in data["value"]]
        return MapItemHasListValue[MapKey, MapValue, MapValueList](key=key, values=values)


class MapHasListValue(BaseModel, Generic[MapKey, MapValue, MapValueList]):
    items: list[MapItemHasListValue[MapKey, MapValue, MapValueList]]

    def __init__(self, items: list[MapItemHasListValue[MapKey, MapValue, MapValueList]]|None = None):
        if items is None:
            items = []
        super().__init__(items=items)

    @staticmethod
    def empty()->'MapHasListValue[MapKey, MapValue, MapValueList]':
        return MapHasListValue[MapKey, MapValue, MapValueList](items=[])
    
    def dumpToTypedDict(self):
        ret_dict:dict[Literal["items"], list[MapItemDictHasListValue]] = {}
        ret_dict["items"] = []
        for item in self.items:
            ret_dict["items"].append(item.toTypedDict())
        return ret_dict

    def toDict(self)-> dict[MapKey, list[MapValue]]:
        ret: dict[MapKey, list[MapValue]] = {}
        for item in self.items:
            key = item.key
            values = item.values
            ret[key] = values
        return ret
            
    @classmethod
    def fromDict(cls, data: dict[Literal["items"], list[MapItemDictHasListValue]], key_type: type[MapKey], value_type: type[MapValue]):
        items = []
        for item in data["items"]:
            key = key_type(**item["key"])
            
            values:list[MapValue] = []
            for v in item["value"]:
                values.append(value_type(**v))
            items.append(MapItemHasListValue[MapKey, MapValue, MapValueList](key=key, values=values)) 
        return cls(items=items)

    def get(self, key: MapKey) -> list[MapValue]:
        dict = self.toDict()
        return dict[key]
    
    def getByList(self, key: MapKey) -> list[MapValue]:
        for item in self.items:
            if item.key == key:
                return item.values
        return []
    
    @staticmethod
    def setLine(key: MapKey, values: list[MapValue])->'MapHasListValue[MapKey, MapValue, MapValueList]':
        return MapHasListValue[MapKey, MapValue, MapValueList](items=[MapItemHasListValue[MapKey, MapValue, MapValueList](key=key, values=values)])

    def set(self, key: MapKey, values: list[MapValue])->'MapHasListValue[MapKey, MapValue, MapValueList]':
        self.items.append(MapItemHasListValue[MapKey, MapValue, MapValueList](key=key, values=values))
        return self
    
    @property
    def keys(self)->list[MapKey]:
        return [item.key for item in self.items]
    
    @property
    def values(self)->list[list[MapValue]]:
        return [item.values for item in self.items]
    
    @classmethod
    def loadJson(cls, path: Path, key_type: Type[MapKey], value_type: Type[MapValue]):
        with open(path, 'r', encoding="utf-8") as f:
            data = json.load(f)
        return cls.fromDict(data, key_type, value_type)