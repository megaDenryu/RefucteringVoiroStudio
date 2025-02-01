import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Dict, Type, List, Dict as TypingDict, TypedDict, get_origin, get_args
from enum import Enum

from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc

class importInfo(TypedDict):
    model: Type[BaseModel]
    path: Path

"""
今のTypeScriptFormatGeneratorのバグはリスト内にオブジェクトを入れるとき、そのオブジェクトの型が別のファイルにある場合、importを生成しないこと
またはオブジェクトがフォルダ構造上全く関係ないところのBaseModelを参照している場合、importを生成しないこと
"""

class TypeScriptFormatGenerator:
    model: Type[BaseModel]
    properties: dict[str, Any]
    importPathList: list[importInfo]
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
        visualTitle: null
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
        for importInfo in self.importPathList:
            model = importInfo["model"]
            importFilePath = importInfo["path"]
            importContent += f"import {{ {model.__name__}Format }} from \"{(self.createRelativePath(self.targetTsPath,importFilePath)).replace('.ts', '')}\";\n"
        return importContent
    
    def saveThisModel(self):
        self.targetTsPath = self.calcSavePath(self.model)
        targetTsDir = self.targetTsPath.parent
        ExtendFunc.ExtendPrintWithTitle("モデルをセーブします",{
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
        elif prop_type == int or prop_type == float:
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
            return f"        {prop}: {prop_type.__name__}Format as InputTypeObject,\n"
        else:
            raise TypeError(f"Unsupported property type: {prop_type}")

        # フッタで "        } as InputTypeXXX," を付ける
        result += body
        result += f"        }} as {type_as},\n"
        return result

    def _generate_string_format(self) -> str:
        return """            type: "string",
            collectionType: null,
            format: { visualType: "string", visualTitle: null }
"""

    def _generate_number_format(self) -> str:
        return """            type: "number",
            collectionType: null,
            format: { visualType: "number", visualTitle: null, step: 1 }
"""

    def _generate_boolean_format(self) -> str:
        return """            type: "boolean",
            collectionType: null,
            format: { visualType: "boolean", visualTitle: null }
"""

    def _generate_enum_format(self) -> str:
        return """            type: "enum",
            collectionType: null,
            format: { visualType: "enum", visualTitle: null }
"""

    def _generate_array_format(self, prop_type: Any) -> str:
        element_type = get_args(prop_type)[0]
        if isinstance(element_type, type) and issubclass(element_type, BaseModel):
            collection_type = element_type.__name__
        else:
            collection_type = "null"

        return f"""            type: "array",
            collectionType: {{
                type: "{self._get_raw_type_name(element_type)}",
                collectionType: {collection_type},
                format: {{ visualType: "{self._get_raw_type_name(element_type)}", visualTitle: null }}
            }},
            format: {{ visualType: "array", visualTitle: null }}
"""

    def _generate_record_format(self, prop_type: Any) -> str:
        value_type = get_args(prop_type)[1]
        if isinstance(value_type, type) and issubclass(value_type, BaseModel):
            collection_type = value_type.__name__
        else:
            collection_type = "null"
        return f"""            type: "record",
            collectionType: {{
                type: "{self._get_raw_type_name(value_type)}",
                collectionType: {collection_type},
                format: {{ visualType: "{self._get_raw_type_name(value_type)}", visualTitle: null, step: 1 }}
            }},
            format: {{ visualType: "record", visualTitle: null }}
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
        elif isinstance(prop_type, type) and issubclass(prop_type, BaseModel):
            return "InputTypeObject"
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
            self.importPathList.append({
                "model":prop_type,
                "path":self.calcSavePath(prop_type)
            })
            型の変換と保存(prop_type)

    @staticmethod
    def calcTsRelativeDir(filePath: Path, targetDir:str)->str:
        """
        filePathからtargetDirまでの相対パスを計算する
        "../.."のような文字列を計算する。最後の/は含まない
        """
        # filePathがfileかdirかで処理を分ける
        if filePath.is_file():
            nowDirPath = filePath.parent
        else:
            nowDirPath = filePath
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
        ExtendFunc.ExtendPrint([{
            "filePath": filePath,
            "targetDir": targetDir,
        },{
            "nowDirPath": nowDirPath,
            "回数": n,
            "ret": ret
        }])
        return ret[:-1]
    
    @staticmethod
    def createRelativePath(basePath: Path, targetPath: Path) -> str:
        """
        basePathから見たtargetPathの相対パスを計算する
        """
        state = "正常"
        try:
            relativePath = targetPath.relative_to(basePath.parent)
        except ValueError:
            # targetPath が basePath のサブパスでない場合の処理
            state = "targetPath が basePath のサブパスでない"
            basePath = basePath.resolve()
            targetPath = targetPath.resolve()
            
            # 共通の親ディレクトリを見つける
            common_parts = [part for part, target_part in zip(basePath.parts, targetPath.parts) if part == target_part]
            common_path = Path(*common_parts)
            
            # basePathから共通の親ディレクトリまでの相対パスを計算
            base_to_common = basePath.relative_to(common_path)
            # targetPathから共通の親ディレクトリまでの相対パスを計算
            target_to_common = targetPath.relative_to(common_path)
            
            # basePathからtargetPathへの相対パスを計算
            relativePath = Path(*(['..'] * len(base_to_common.parts)) + list(target_to_common.parts))

        relativePathStr = str(relativePath).replace("\\", "/")
        if not relativePathStr.startswith("../") and not relativePathStr.startswith("./"):
            relativePathStr = "./" + relativePathStr

        ExtendFunc.ExtendPrint([{
            "basePath": str(basePath),
            "targetPath": str(targetPath),
        },{
            "relativePath": relativePathStr
        }], state)
        return relativePathStr
    

def 型の変換と保存(model: Type[BaseModel]):
    generator = TypeScriptFormatGenerator(model)
    generator.saveThisModel()



