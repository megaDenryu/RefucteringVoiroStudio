import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Dict, Type, List, Dict as TypingDict, get_origin, get_args
from enum import Enum

from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

class TypeScriptFormatGenerator:
    def __init__(self, model: Type[BaseModel]):
        self.model = model
        self.properties = model.__annotations__

    def generate(self) -> str:
        ts_format = f"""export const {self.model.__name__}:InputTypeObject = {{
    type: "object",
    collectionType: {{
"""
        for prop, prop_type in self.properties.items():
            ts_format += self._generate_property_format(prop, prop_type)

        ts_format += """    },
    format: {
        visualType: "object",
    },
}
"""
        return ts_format

    def _generate_property_format(self, prop: str, prop_type: Any) -> str:
        # プロパティのヘッダ
        result = f"        {prop}: {{\n"

        # プロパティの中身
        if prop_type == str:
            body = self._generate_string_format()
            type_as = "InputTypeString"
        elif prop_type == int:
            body = self._generate_number_format()
            type_as = "InputTypeNumber"
        elif prop_type == bool:
            body = self._generate_boolean_format()
            type_as = "InputTypeBoolean"
        elif isinstance(prop_type, type) and issubclass(prop_type, Enum):
            body = self._generate_enum_format()
            type_as = "InputTypeEnum"
        elif get_origin(prop_type) == list:
            body = self._generate_array_format(prop_type)
            type_as = f"InputTypeArray<{self._get_type_name(get_args(prop_type)[0])}>"
        elif get_origin(prop_type) == dict:
            body = self._generate_record_format(prop_type)
            type_as = f"InputTypeRecord<{self._get_type_name(get_args(prop_type)[1])}>"
        elif isinstance(prop_type, type) and issubclass(prop_type, BaseModel):
            # ネストされた BaseModel を別のプロセスで出力する想定
            return f"        {prop}: {prop_type.__name__} as InputTypeObject,\n"
        else:
            raise TypeError(f"Unsupported property type: {prop_type}")

        # フッタで "        } as InputTypeXXX," を付ける
        result += body
        result += f"        }} as {type_as},\n"
        return result

    def _generate_string_format(self) -> str:
        return """            type: "string",
            collectionType: null,
            format: { visualType: "string" }
"""

    def _generate_number_format(self) -> str:
        return """            type: "number",
            collectionType: null,
            format: { visualType: "number", step: 1 }
"""

    def _generate_boolean_format(self) -> str:
        return """            type: "boolean",
            collectionType: null,
            format: { visualType: "boolean" }
"""

    def _generate_enum_format(self) -> str:
        return """            type: "enum",
            collectionType: null,
            format: { visualType: "enum" }
"""

    def _generate_array_format(self, prop_type: Any) -> str:
        element_type = get_args(prop_type)[0]
        return f"""            type: "array",
            collectionType: {{
                type: "{self._get_raw_type_name(element_type)}",
                collectionType: null,
                format: {{ visualType: "{self._get_raw_type_name(element_type)}" }}
            }},
            format: {{ visualType: "array" }}
"""

    def _generate_record_format(self, prop_type: Any) -> str:
        value_type = get_args(prop_type)[1]
        return f"""            type: "record",
            collectionType: {{
                type: "{self._get_raw_type_name(value_type)}",
                collectionType: null,
                format: {{ visualType: "{self._get_raw_type_name(value_type)}", step: 1 }}
            }},
            format: {{ visualType: "record" }}
"""

    def _get_type_name(self, prop_type: Any) -> str:
        if prop_type == str:
            return "InputTypeString"
        elif prop_type == int:
            return "InputTypeNumber"
        elif prop_type == bool:
            return "InputTypeBoolean"
        elif isinstance(prop_type, type) and issubclass(prop_type, Enum):
            return "InputTypeEnum"
        elif get_origin(prop_type) == list:
            return "InputTypeArray"
        elif get_origin(prop_type) == dict:
            return "InputTypeRecord"
        else:
            raise TypeError(f"Unsupported property type: {prop_type}")

    def _get_raw_type_name(self, prop_type: Any) -> str:
        # 実際の type: "string" などに使う短い名前
        if prop_type == str:
            return "string"
        elif prop_type == int:
            return "number"
        elif prop_type == bool:
            return "boolean"
        elif isinstance(prop_type, type) and issubclass(prop_type, Enum):
            return "enum"
        return "object"  # 簡易的に省略




