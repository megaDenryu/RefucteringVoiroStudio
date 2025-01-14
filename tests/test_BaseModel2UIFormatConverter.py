import os
from pathlib import Path
from typing import Type
from pydantic import BaseModel, Field

from api.Extend.BaseModel.BaseModel2UIFormatConverter import (
    TypeScriptFormatGenerator,
)
from api.Extend.ExtendFunc import ExtendFunc

# テスト用のBaseModel
class NestedModel(BaseModel):
    SubValue: str = Field(default="nested value")

class ConvertTestModel(BaseModel):
    Id: str = Field(frozen=True, description="変更不可")
    Name: str = Field(frozen=True, description="変更不可")
    Value: int = Field(ge=0, le=100, default=50)
    IsActive: bool = Field(default=True)
    Options: list[str] = Field(default_factory=list)
    Settings: dict[str, int] = Field(default_factory=dict)
    Nested: NestedModel = Field()  # ネストされたBaseModelを追加

def write_to_ts_file(content: str, file_path: Path):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

def manual_run_test(model: Type[BaseModel]):
    generator = TypeScriptFormatGenerator(model)
    ts_content = generator.generate()
    app_ts_dir = ExtendFunc.api_dir.parent / "app-ts"
    target_dir = app_ts_dir / "src/ZodObject/ConvertTest"
    os.makedirs(target_dir, exist_ok=True)
    output_file_path = target_dir / f"{model.__name__}.ts"
    write_to_ts_file(ts_content, output_file_path)
    print(f"TypeScript format has been written to {output_file_path}")

def ベースモデルのフォーマットを生成するテスト():
    manual_run_test(ConvertTestModel)
    print("ConvertTestModel has been converted to TypeScript format")
    manual_run_test(NestedModel)
    print("NestedModel has been converted to TypeScript format")
    print("test1 done")
