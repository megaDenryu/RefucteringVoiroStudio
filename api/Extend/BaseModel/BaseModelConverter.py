

"""
# このクラスが行うことの概要
BaseModelを入力してJsonSchemaに変換して、さらにそこからtsのZodスキーマに変換する。
BaseModelがapi/xxx/yyy/zzz.pyにある場合、
出力したZodスキーマーを自動でapp-ts/xxx/yyy/zzz.tsに保存する。
"""

import json
from pathlib import Path
import subprocess
from typing import Type

from pydantic import BaseModel

from api.DataStore.JsonAccessor import JsonAccessor
from api.Extend.ExtendFunc import ExtendFunc


class BaseModelConverter:
    base_model_name: str
    jsonSchema_path: Path
    zod_path: Path
    @property
    def appTsRoot(self) -> Path:
        return ExtendFunc.getTargetDirFromParents(__file__, "api").parent / "app-ts"


    def __init__(self, base_model: Type[BaseModel]):
        self.base_model = base_model
        self.base_model_name = base_model.__name__
        self.jsonSchema_path,self.zod_path = self.calcOutPath(base_model)

    def runProcess(self):
        self.convert()
        self.run_tsx_command("main.ts")

    def calcOutPath(self, base_model: Type[BaseModel]):
        # ここで出力先のtsのパスを計算する
        path = base_model.__module__ # api.DataStore.AppSetting.AppSettingModel.AppSettingModel のようになる
        api_parent_path = ExtendFunc.getTargetDirFromParents(__file__, "api").parent
        jsonSchema_path = api_parent_path / (path.replace("api", "app-ts/src/ZodObject").replace(".", "/") + ".json")
        zod_path        = api_parent_path / (path.replace("api", "app-ts/src/ZodObject").replace(".", "/") + ".ts")
        return jsonSchema_path, zod_path

    def convert(self):
        json_schema = self._convert_to_json_schema()
        self._saveJsonSchema(json_schema)

    def _convert_to_json_schema(self) -> dict:
        return self.base_model.model_json_schema()

    def _saveJsonSchema(self, json_schema: dict):
        # self.jsonSchema_pathが存在しない場合は作成する
        self.jsonSchema_path.parent.mkdir(parents=True, exist_ok=True)
        ExtendFunc.saveDictToJson(self.jsonSchema_path, json_schema)

    def _saveTS(self, json_schema: dict):
        
        self.zod_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.zod_path, "w") as f:
            f.write(json.dumps(json_schema, indent=2))


    def run_tsx_command(self, execFilePath: str):
        path = str(self.appTsRoot/execFilePath)
        try:
            # cd C:\Users\pokr301qup\python_dev\VoiroStudio\RefucteringVoiroStudio\app-ts を実行する
            result = subprocess.run(
                f'cd {str(self.appTsRoot)} && npx tsx {path} --modelName={self.base_model_name} --jsonSchemaPath={str(self.jsonSchema_path)} ---zodTsPath={str(self.zod_path)}',
                shell=True,
                check=True,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"Error: {e.stderr}")
        except FileNotFoundError as e:
            print(f"FileNotFoundError: {e}\n\n")


class BaseModelConverterTest:
    
    def __init__(self) -> None:
        pass

    @staticmethod
    def 出力ファイルパスを計算するテスト(base_model: Type[BaseModel]):
        print(BaseModelConverter(base_model).calcOutPath(base_model))
    
    @staticmethod
    def JsonSchemaを出力するテスト(base_model: Type[BaseModel]):
        BaseModelConverter(base_model).convert()

    @staticmethod
    def Zodを出力するテスト(base_model: Type[BaseModel]):
        #  npx tsx .\main.tsを実行する
        BaseModelConverter(base_model).run_tsx_command("main.ts")

    @staticmethod
    def Zodを出力する本番(base_model: Type[BaseModel]):
        json_schema = BaseModelConverter(base_model).runProcess()

    @staticmethod
    def 再帰的にZodを出力する本番(base_model: Type[BaseModel]):
        # base_modelの中にNesteされたBaseModelがある場合、NestedModelもZodに変換する
        # そのためにbase_modelの中のプロパティを再帰的に調べて、BaseModelがあればZodに変換する
        for prop, prop_type in base_model.__annotations__.items():
            if isinstance(prop_type, type) and issubclass(prop_type, BaseModel):
                BaseModelConverterTest.再帰的にZodを出力する本番(prop_type)
        BaseModelConverterTest.Zodを出力する本番(base_model)


