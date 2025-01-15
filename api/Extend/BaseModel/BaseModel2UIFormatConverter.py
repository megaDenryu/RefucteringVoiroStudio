import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Dict, Type, List, Dict as TypingDict, get_origin, get_args
from enum import Enum

from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

class TypeScriptFormatGenerator:
    model: Type[BaseModel]
    properties: dict[str, Any]
    importPathList: list[Path]
    targetTsPath: Path|None = None
    processFlag = {
        "contentGenerated": False,
        "importContentGenerated": False
    }
    def __init__(self, model: Type[BaseModel]):
        self.model = model
        self.properties = model.__annotations__
        self.importPathList = []

    def calcSavePath(self, base_model: Type[BaseModel])->Path:
        # ここで出力先のtsのパスを計算する。zodのtsファイルと同じフォルダに出力する。zodのtsファイルがxxx.tsなら、こちらはxxxFormat.tsとする
        path = base_model.__module__ # api.DataStore.AppSetting.AppSettingModel.AppSettingModel のようになる
        api_parent_path = ExtendFunc.getTargetDirFromParents(__file__, "api").parent
        uiformat_path = api_parent_path / (path.replace("api", "app-ts/src/ZodObject").replace(".", "/") + "Format.ts")
        return uiformat_path

    def generate(self) -> str:
        ts_format = f"""export const {self.model.__name__}Format:InputTypeObject = {{
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
        self.processFlag["contentGenerated"] = True
        return ts_format
    
    def generateImportContent(self) -> str:
        if not self.processFlag["contentGenerated"]:
            raise Exception("generateメソッドを先に実行してください")
        if self.targetTsPath is None:
            raise Exception("targetTsPathを先に計算してください")
        src_relative_dir = self.calcTsRelativeDir(self.targetTsPath, "src")
        importContent = f"""
import {{ InputTypeObject, InputTypeString, InputTypeNumber, InputTypeBoolean, InputTypeArray, InputTypeRecord, InputTypeEnum }} from \"{src_relative_dir}/UiComponent/TypeInput/TypeComponentFormat/TypeComponentFormat\";\n
"""
        for importFilePath in self.importPathList:
            importContent += f"import {{ {importFilePath.stem} }} from \"{self.createRelativePath(self.targetTsPath,importFilePath)}\";\n"
        return importContent
    
    def saveThisModel(self):
        self.targetTsPath = self.calcSavePath(self.model)
        targetTsDir = self.targetTsPath.parent
        ExtendFunc.ExtendPrint({
            "targetTsPath": self.targetTsPath,
            "targetTsDir": targetTsDir
        })

        content = self.generate()
        importContent = self.generateImportContent()
        os.makedirs(targetTsDir, exist_ok=True)
        with open(self.targetTsPath, "w", encoding="utf-8") as f:
            f.write(importContent)
            f.write(content)


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
            self._processNestedModel(prop_type)
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
    
    def _processNestedModel(self, prop_type: type[BaseModel]):
            self.importPathList.append(self.calcSavePath(prop_type))
            型の変換と保存(prop_type)

    @staticmethod
    def calcTsRelativeDir(filePath: Path, targetDir:str)->str:
        """
        filePathからtargetDirまでの相対パスを計算する
        "../.."のような文字列を計算する。最後の/は含まない
        """
        # filePathがfileかdirかで処理を分ける
        ExtendFunc.ExtendPrint({
            "filePath": filePath,
            "targetDir": targetDir
        })
        if filePath.is_file():
            nowDirPath = filePath.parent
        else:
            nowDirPath = filePath
        ExtendFunc.ExtendPrint({
            "nowDirPath": nowDirPath
        })
        # まず何回親に行けばいいか計算
        n = 0
        path = nowDirPath
        while True:
            if path.stem == targetDir:
                break
            path = path.parent
            n += 1
        # 回数分の../を返す
        ret =  "../" * n
        return ret[:-1]
    
    @staticmethod
    def createRelativePath(basePath: Path, targetPath: Path)->str:
        """
        basePathから見たtargetPathの相対パスを計算する
        """
        relativePath = targetPath.relative_to(basePath.parent)
        return str(relativePath)
    
    

def 型の変換と保存(model: Type[BaseModel]):
    generator = TypeScriptFormatGenerator(model)
    generator.saveThisModel()



