from pydantic import BaseModel
from typing import Dict, Generic, List, Literal, Type, TypeVar
from pathlib import Path
import json


class HashableBaseModel(BaseModel):
    def __hash__(self):
        return hash(frozenset(self.model_dump().items()))
    def __eq__(self, other):
        if isinstance(other, HashableBaseModel):
            return hash(self) == hash(other)
        return False

MapKey = TypeVar('MapKey', bound='HashableBaseModel')
MapValue = TypeVar('MapValue', bound='HashableBaseModel')

class MapItem(Generic[MapKey, MapValue], HashableBaseModel):
    key: MapKey
    value: MapValue

class Map(Generic[MapKey, MapValue], BaseModel):
    items: List[MapItem[MapKey,MapValue]]

    def __init__(self, items: List[MapItem[MapKey, MapValue]]|None = None):
        if items is None:
            items = []
        super().__init__(items=items)

    @staticmethod
    def empty()->'Map[MapKey, MapValue]':
        return Map[MapKey, MapValue](items=[])
    
    def dumpToJsonDict(self)->Dict[Literal["items"], List[Dict[MapKey, MapValue]]]:
        return {"items": [item.model_dump() for item in self.items]} # type: ignore

    def toDict(self)-> Dict[MapKey, MapValue]:
        ret: Dict[MapKey, MapValue] = {}
        for item in self.items:
            ret[item.key] = item.value
        return ret
            

    @classmethod
    def fromDict(cls, data: dict, key_type: Type[MapKey], value_type: Type[MapValue]):
        items = [
            MapItem[MapKey, MapValue](
                key=key_type(**item["key"]),
                value=value_type(**item["value"])
            )
            for item in data["items"]
        ]
        return cls(items=items)

    def get(self, key: MapKey) -> MapValue:
        dict = self.toDict()
        return dict[key]
    
    def getByList(self, key: MapKey) -> MapValue:
        for item in self.items:
            if item.key == key:
                return item.value
        raise KeyError(f"key:{key} が見つからない")
    
    @staticmethod
    def setLine(key: MapKey, value: MapValue)->'Map[MapKey, MapValue]':
        return Map[MapKey, MapValue](items=[MapItem[MapKey, MapValue](key=key, value=value)])

    def set(self, key: MapKey, value: MapValue)->'Map[MapKey, MapValue]':
        for item in self.items:
            if item.key == key:
                item.value = value
                return self
        self.items.append(MapItem(key=key, value=value))
        return self
    
    @property
    def keys(self)->List[MapKey]:
        return [item.key for item in self.items]
    
    @property
    def values(self)->List[MapValue]:
        return [item.value for item in self.items]
    
    @classmethod
    def loadJson(cls, path: Path, key_type: Type[MapKey], value_type: Type[MapValue]):
        with open(path, 'r', encoding="utf-8") as f:
            data = json.load(f)
        return cls.fromDict(data, key_type, value_type)