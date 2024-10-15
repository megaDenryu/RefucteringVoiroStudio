from typing import Generic, Literal, Sequence, TypeVar, TypedDict

from pydantic import BaseModel

from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel


MapKey = TypeVar('MapKey', bound='HashableBaseModel')
MapValue = TypeVar('MapValue', bound='HashableBaseModel')
MapValueList = TypeVar('MapValueList', bound='Sequence[HashableBaseModel]')

class ListableDictItem(TypedDict):
    key: dict
    value: list[dict]

class ListableMapItem(Generic[MapKey, MapValue, MapValueList], HashableBaseModel):
    key: MapKey
    values: list[MapValue]

    def toTypedDict(self)->ListableDictItem:
        return ListableDictItem(key=self.key.model_dump(), value=[value.model_dump() for value in self.values])
    
    @staticmethod
    def fromTypedDict(data: ListableDictItem, key_type: type[MapKey], value_type: type[MapValue]):
        key = key_type(**data["key"])
        values = [value_type(**value) for value in data["value"]]
        return ListableMapItem[MapKey, MapValue, MapValueList](key=key, values=values)


class ListableMap(Generic[MapKey, MapValue, MapValueList], BaseModel):
    items: list[ListableMapItem[MapKey, MapValue, MapValueList]]

    def __init__(self, items: list[ListableMapItem[MapKey, MapValue, MapValueList]]|None = None):
        if items is None:
            items = []
        super().__init__(items=items)

    @staticmethod
    def empty()->'ListableMap[MapKey, MapValue, MapValueList]':
        return ListableMap[MapKey, MapValue, MapValueList](items=[])
    
    def dumpToTypedDict(self):
        ret_dict:dict[Literal["items"], list[ListableDictItem]] = {}
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
    def fromDict(cls, data: dict[Literal["items"], list[ListableDictItem]], key_type: type[MapKey], value_type: type[MapValue]):
        items = []
        for item in data["items"]:
            key = key_type(**item["key"])
            
            values:list[MapValue] = []
            for v in item["value"]:
                values.append(value_type(**v))
            items.append(ListableMapItem[MapKey, MapValue, MapValueList](key=key, values=values)) 
        return cls(items=items)

    def get(self, key: MapKey) -> MapValueList:
        dict = self.toDict()
        return dict[key]