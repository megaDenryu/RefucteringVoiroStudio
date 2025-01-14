import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Dict, Type, List, Dict as TypingDict, get_origin, get_args
from enum import Enum

from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

def generate_ts_format(model: Type[BaseModel]) -> str:
    properties = model.__annotations__
    ts_format = f"export const {model.__name__}:InputTypeObject = {{\n"
    ts_format += "    type: \"object\",\n"
    ts_format += "    collectionType: {\n"

    for prop, prop_type in properties.items():
        ts_format += f"        {prop}: {{\n"
        if prop_type == str:
            ts_format += "            type: \"string\",\n"
            ts_format += "            collectionType: null,\n"
            ts_format += "            format: { visualType: \"string\" }\n"
            ts_format += "        } as InputTypeString,\n"
        elif prop_type == int:
            ts_format += "            type: \"number\",\n"
            ts_format += "            collectionType: null,\n"
            ts_format += "            format: { visualType: \"number\", step: 1 }\n"
            ts_format += "        } as InputTypeNumber,\n"
        elif prop_type == bool:
            ts_format += "            type: \"boolean\",\n"
            ts_format += "            collectionType: null,\n"
            ts_format += "            format: { visualType: \"boolean\" }\n"
            ts_format += "        } as InputTypeBoolean,\n"
        elif isinstance(prop_type, type) and issubclass(prop_type, Enum):
            ts_format += "            type: \"enum\",\n"
            ts_format += "            collectionType: null,\n"
            ts_format += "            format: { visualType: \"enum\" }\n"
            ts_format += "        } as InputTypeEnum,\n"
        elif get_origin(prop_type) == list:
            ts_format += "            type: \"array\",\n"
            ts_format += "            collectionType: [],\n"
            ts_format += "            format: { visualType: \"array\" }\n"
            ts_format += "        } as InputTypeArray,\n"
        elif get_origin(prop_type) == dict:
            ts_format += "            type: \"record\",\n"
            ts_format += "            collectionType: {},\n"
            ts_format += "            format: { visualType: \"record\" }\n"
            ts_format += "        } as InputTypeRecord,\n"
        else:
            raise TypeError(f"Unsupported property type: {prop_type}")

    ts_format += "    },\n"
    ts_format += "    format: {\n"
    ts_format += "        visualType: \"object\",\n"
    ts_format += "    },\n"
    ts_format += "}\n"

    return ts_format

# テスト用のBaseModel
class ConvertTestModel(BaseModel):
    Id: str = Field(frozen=True, description="変更不可")
    Name: str = Field(frozen=True, description="変更不可")
    Value: int = Field(ge=0, le=100, default=50)
    IsActive: bool = Field(default=True)
    Options: List[str] = Field(default_factory=list)
    Settings: dict[str, int] = Field(default_factory=dict)

def write_to_ts_file(content: str, file_path: Path):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# テスト実行
def BaseModelからフォーマット定義のtsを自動生成する():
    model: Type[BaseModel] = ConvertTestModel
    ts_content = generate_ts_format(model)
    app_ts_dir = ExtendFunc.api_dir.parent / "app-ts" #app-ts\src\ZodObject\DataStore
    target_dir = app_ts_dir / "src/ZodObject/ConvertTest"
    os.makedirs(target_dir, exist_ok=True)
    output_file_path = target_dir / f"{model.__name__}.ts"
    write_to_ts_file(ts_content, output_file_path)
    print(f"TypeScript format has been written to {output_file_path}")

# テスト実行
BaseModelからフォーマット定義のtsを自動生成する()


